import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QrsService } from './qrs.service';
import { Qr } from 'src/core/entities/qr';
import { Exception } from 'src/core/shared/exception';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';
import { Message } from 'src/core/shared/message';

@UseGuards(AuthGuard)
@ApiTags('Qrs')
@Controller('qrs')
export class QrsController {
  
  constructor(private readonly qrsService: QrsService) { }

  /**
   * endpoints related to the camera module mainly
   * @param qrId 
   * @returns 
   */

  @Get(':id')
  getQr(@Param('id') qrId: string) {
    return new Promise<Qr>((resolve, reject) => {
      this.qrsService.findQr(qrId)
        .then((result) => {
          resolve(result);
        }).catch((err: Exception) => {
          reject(err.getException());
        });
    })
  }

  @Post("assign")
  assignHanger(@Body() qr: any) {
    return this.qrsService.assignHanger(qr)
  }

  @Post("detach")
  detachHanger(@Body() qr: any) {
    return this.qrsService.detachHanger(qr)
  }



  /**
   * functions related to the item list
   * @param clubId 
   * @returns 
   */

  @Get()
  listQrs(@Query('clubId') clubId: string) {
    return new Promise<Array<Qr>>((resolve, reject) => {
      this.qrsService.listQrs(clubId)
        .then((result) => {
          resolve(result);
        }).catch((err: Exception) => {
          reject(err);
        });
    })
  }

  @Get('breaks')
  listAllActiveBreaks() {
    return new Promise<Map<string, any>>((resolve, reject) => {
      this.qrsService.listBreaks()
        .then((result) => {
          console.log(result);
          resolve(result)
        }).catch((err: Exception) => {
          reject(err);
        });
    });
  }

  

  @Patch(':id')
  updateQr(@Param('id') qrId: string, @Body() qr: Qr) {
    return new Promise<any>((resolve, reject) => {
      this.qrsService.updateQr(qrId, qr)
        .then((result) => {
          resolve(result);
        }).catch((err: Exception) => {
          reject(err);
        });
    })
  }

  @Patch("break/:id")
  takeBreak(@Param('id') qrId: string) {
    return new Promise<Message>((resolve, reject) => {
      this.qrsService.takeBreakTime(qrId)
        .then((result: Message) => {
          resolve(result);
        }).catch((err: Exception) => {
          reject(err.getException());
        });
    })
  }

  @Patch("break/stop/:id")
  stopBreak(@Param('id') qrId: string) {
    return new Promise<Message>((resolve, reject) => {
      this.qrsService.stopBreakTime(qrId)
        .then((result: Message) => {
          resolve(result);
        }).catch((err: Exception) => {
          reject(err.getException());
        });
    })
  }

}