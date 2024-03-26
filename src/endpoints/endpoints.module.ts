import { Module } from '@nestjs/common';
import { HangersModule } from './hangers/hangers.module'; 
import { ReposModule } from 'src/repos/repos.module';
import { QrsModule } from './qrs/qrs.module';
import { ClubsModule } from './clubs/clubs.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module'; 
import { EmailModule } from './email/email.module'; 
import { PlansModule } from './plans/plans.module';


@Module({
    imports: [
        /** generic modules */
        AuthModule,
        ReposModule,
        /** employees modules */
        QrsModule,
        HangersModule,
        ClubsModule,
        OrdersModule,
        EmailModule,
        
        /** super admin modules */
        PlansModule,
    ]
})
export class EndpointsModule {}
