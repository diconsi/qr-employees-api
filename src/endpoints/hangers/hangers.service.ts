import { Injectable } from '@nestjs/common';
import { Hanger } from 'src/core/entities/hanger';
import { HangersManagerService } from 'src/repos/hangers-manager/hangers-manager.service';
import { LocationNotProvidedException } from 'src/core/exceptions/location-not-provided-exception';

@Injectable()
export class HangersService {

  constructor(
    private hangersRepo: HangersManagerService
  ) { }

  async listByLocation(locationId: string): Promise<Array<Hanger>> {
    try {
      if (!locationId)
        throw new LocationNotProvidedException(new Error('the location was not provided'))
      let hangers = await this.hangersRepo.list(locationId)
      return hangers;
    } catch (error) {
      throw error;
    }
  }

}
