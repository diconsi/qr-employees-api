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
    return this.qrsService.findQr(qrId);
  }

  @Post("assign")
  assignHanger(@Body() qr: any) {
    return this.qrsService.assignHanger(qr)
  }

  @Post("detach")
  detachHanger(@Body() qr: any) {
    return this.qrsService.detachHanger(qr)
  }

  /** functions related to the item list */

  @Get()
  listQrs(@Query('clubId') clubId: string) {
    return this.qrsService.listQrs(clubId);
  }

  @Get('breaks')
  listAllActiveBreaks() {
    return this.qrsService.listBreaks();
  }

  @Patch("break/:id")
  takeBreak(@Param('id') qrId: string) {
    return this.qrsService.takeBreakTime(qrId);
  }

}