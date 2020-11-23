import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { JewelModule } from './controllers/jewel/jewel.module';
import { OrderModule } from './controllers/order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DB_HOST || 'mongodb://localhost:27017/'}${process.env.DB_NAME || 'jewelry'}`),
    JewelModule,
    OrderModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
