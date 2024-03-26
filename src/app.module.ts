import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ScheduleModule } from "@nestjs/schedule";
import { EndpointsModule } from './endpoints/endpoints.module';
config();

const { URI_MONGODB } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(URI_MONGODB),
    ScheduleModule.forRoot(),
    EndpointsModule,
  ],
})
export class AppModule { }
