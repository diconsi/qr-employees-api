import { Module } from '@nestjs/common';
import { HangersManagerService } from './hangers-manager/hangers-manager.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hanger, hangerSchema } from 'src/core/entities/hanger';
import { Qr, QrSchema } from 'src/core/entities/qr';
import { QrRepoService } from './qr-repo/qr-repo.service';
import { ClubsRepoService } from './clubs-repo/clubs-repo.service';
import { Club, clubSchema } from 'src/core/entities/club';
import { Location, locationSchema } from 'src/core/entities/location';
import { SlotsManagerService } from './slots-manager/slots-manager.service';
import { Slot, slotSchema } from 'src/core/entities/slot';
import { LocationsRepoService } from './locations-repo/locations-repo.service';
import { OrdersRepoService } from './orders-repo/orders-repo.service';
import { Order, OrderSchema } from 'src/core/entities/order';
import { UsersRepoService } from './users-repo/users-repo.service';
import { User, UserSchema } from 'src/core/entities/user';
import { PlansRepoService } from './plans-repo/plans-repo.service';
import { Plan, PlanSchema } from 'src/core/entities/plan';

const repos = [
  HangersManagerService,
  SlotsManagerService,
  QrRepoService,
  ClubsRepoService,
  LocationsRepoService,
  OrdersRepoService,
  UsersRepoService,
  PlansRepoService
]

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hanger.name, schema: hangerSchema },
      { name: Qr.name, schema: QrSchema },
      { name: Club.name, schema: clubSchema },
      { name: Location.name, schema: locationSchema },
      { name: Slot.name, schema: slotSchema },
      { name: Order.name, schema: OrderSchema},
      { name: User.name, schema: UserSchema },
      { name: Plan.name, schema: PlanSchema }
    ])
  ],
  providers: repos,
  exports: repos
})
export class ReposModule {}
