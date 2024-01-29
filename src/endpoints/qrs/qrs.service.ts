import { Injectable, LoggerService } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { Qr } from 'src/core/entities/qr';
import { QrRepoService } from 'src/repos/qr-repo/qr-repo.service';
import { CronJob } from 'cron';
import { FetchEntityException } from 'src/core/exceptions/fetch-entity-exception';
import { ClubsRepoService } from 'src/repos/clubs-repo/clubs-repo.service';
import { QRNotFoundException } from 'src/core/exceptions/qr-not-found-exception';
import { BreakTime } from "../../core/entities/qr";
import { MaximumBreaktimesExceededException } from 'src/core/exceptions/maximum-breaktimes-exceeded-exception';
import { BreaktimeAlreadyRunningException } from 'src/core/exceptions/breaktime-already-running-exception';
import { HangersService } from '../hangers/hangers.service';
import { Types } from 'mongoose';
import { ClubNotFoundException } from 'src/core/exceptions/club-not-found.exception';
import { QrNotCandidateForBreakException } from 'src/core/exceptions/qr-not-candidate-for-break.exception';
import { ActiveBreakException } from 'src/core/exceptions/active-break-exception';
import { ExpiredQrException } from 'src/core/exceptions/expired-qr-exception';
import { BreakNotRecordedException } from 'src/core/exceptions/break-not-recorded-exception';


type Time = {
    seconds: number;
    minutes: number;
    hours: number;
}

@Injectable()
export class QrsService {

    constructor(
        private qrRepo: QrRepoService,
        private clubsRepo: ClubsRepoService,
        private registry: SchedulerRegistry,
        private hangersService: HangersService
    ) { }

    async listQrs(clubId: string) {
        try {
            let qrs = await this.qrRepo.listQrsByClubId(clubId);
            return qrs;
        } catch (error) {
            throw error;
        }
    }

    async listBreaks(): Promise<Map<string, any>> {
        try {
            let crons = this.registry.getCronJobs();
            return crons;
        } catch (error) {
            throw error;
        }
    }

    async findQr(qrId: string): Promise<Qr> {
        try {
            let qr = await this.qrRepo.findOne(qrId);
            if (!qr)
                throw new QRNotFoundException(new Error('no qr was founded'))
            qr.active = !qr.used ? true : qr.active;
            qr.used = qr.used || true;
            await this.qrRepo.update(qrId, qr);
            return qr;
        } catch (error) {
            throw error;
        }
    }

    async updateQr(qrId: string, qr: Qr) {
        try {
            let qrData = await this.qrRepo.update(qrId, qr);
            return qrData;
        } catch (error) {
            throw error;
        }
    }

    @Cron("0 0 5 * * *")
    // @Cron("0 * * * * *")
    async disableQr() {
        try {
            await this.qrRepo.disableOldQrs()
        } catch (error) {
            // TODO: add logic to handle exceptions from disabling old qrs
        }
    }

    async takeBreakTime(qrId: string) {
        try {
            let qr = await this.qrRepo.findOne(qrId);
            if (!qr)
                throw new QRNotFoundException(new Error('Qr not found'));
            let club = await this.clubsRepo.findClub(qr.clubId);
            if (!club)
                throw new ClubNotFoundException(new Error('there was a problem finding your club'));
            if (!qr.hanger)
                throw new QrNotCandidateForBreakException(new Error("the qr does not contain a hanger"))
            if (qr.activeBreak)
                throw new ActiveBreakException(new Error("there is a break already active"));
            if (qr.breaks.length >= club.breakNumber)
                throw new MaximumBreaktimesExceededException(new Error("the maximum number of breaktimes has been exceeded"));
            let hangerId = await qr.hanger["_id"] as Types.ObjectId;
            await this.hangersService.detach(hangerId.toString(), qrId);
            if (!qr.active)
                throw new ExpiredQrException(new Error("the given qr is already expired"));
            let usedTime = 0;
            let finishTime = new Date(Date.now() + club.breakTime * 60 * 1000 - usedTime);
            let cronTime;
            let { seconds, minutes, hours } = this.getTime(finishTime);
            cronTime = `${seconds} ${minutes} ${hours} * * *`;
            let job = new CronJob(cronTime, async () => {
                qr.active = false;
                this.qrRepo.update(qrId, qr);
                this.registry.deleteCronJob(qrId);
            })
            this.registry.addCronJob(qrId, job as any);
            job.start()
            let breaktime: BreakTime = {
                start: new Date(),
                finish: undefined
            }
            if (!qr.breaks) qr.breaks = [breaktime];
            else qr.breaks = [...qr.breaks, breaktime];
            qr.activeBreak = true;

            await this.qrRepo.update(qrId, qr)
                .catch(error => { throw new BreakNotRecordedException(error) });

            return {
                name: 'success',
                message: 'Break Time initialized successfully'
            }
        } catch (error) {
            throw error;
        }
    }


    getTime(date: Date): Time {
        let seconds = date.getSeconds();
        let minutes = date.getMinutes();
        let hours = date.getHours();
        return { seconds, minutes, hours };
    }

    async stopBreakTime(qrId: string) {
        try {
            let qr = await this.qrRepo.findOne(qrId);
            try {
                this.registry.deleteCronJob(qrId);
            } catch (error) {
                throw new FetchEntityException(new Error("The cron job was not found"))
            }
            let finish = new Date();
            let lastBreak = qr.breaks.pop();
            lastBreak.finish = finish;
            qr.breaks.push(lastBreak);
            qr.activeBreak = false;

            // TODO: ADD LOGIC THAT IF A BREAK REACHED ITS MAXIMUM IT WILL DEACTIVATE THE QR

            await this.qrRepo.update(qrId, qr);
            return {
                name: 'success',
                message: 'Break Time stopped successfully'
            };
        } catch (error) {
            throw error;
        }
    }
}
