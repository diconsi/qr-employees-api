import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('Clubs')
@Controller('clubs')
export class ClubsController {

  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  getClubs(@Query('adminId') adminId: string) {
    return this.clubsService.listClubsByAdminId(adminId);
  }

  @Get(':id')
  getClubData(@Param('id') clubId : string) {
    return this.clubsService.getClub(clubId);
  }
}
