import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Exception } from 'src/core/shared/exception';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/core/guards/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('locations')
@Controller('locations')
export class LocationsController {

  constructor(private readonly locationsService: LocationsService) {}

  @Get('count')
  countSlotsOfLocation(@Query('locationId') locationId : string) {
    return new Promise<any>((resolve, reject) => {
      this.locationsService.countSlots(locationId)
      .then((result) => { 
        resolve(result);
      })
      .catch((err : Exception) => {
        reject(err)
      });
    })
  }
}
