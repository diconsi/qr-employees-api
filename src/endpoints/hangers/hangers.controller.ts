import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { HangersService } from './hangers.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Hangers')
@Controller('hangers')
export class HangersController {
  constructor(private readonly hangersService: HangersService) { }

  @Get()
  listByLocation(@Query('locationId') locationId: string) {
    return this.hangersService.listByLocation(locationId);
  }

}
