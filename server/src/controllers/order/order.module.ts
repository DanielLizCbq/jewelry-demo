import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Order, OrderEntity } from '../../domain/entities/order.entity';
import { JewelModule } from '../../controllers/jewel/jewel.module';
import { OrderRepository } from '../../domain/repository/order/order.repository';
import { OrderController } from './order.controller';
import { CreateOrderData } from '../../use_cases/order/create-order.data';
import { FindAllOrdersData } from '../../use_cases/order/find-all-orders.data';
import { FindOrderByIdData } from '../../use_cases/order/find-order-by-id.data';
import { DeleteOrderData } from '../../use_cases/order/delete-order.data';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderEntity }]),
    JewelModule,
  ],
  providers: [
    OrderRepository,
    {
      inject: [OrderRepository],
      provide: 'CreateOrderData',
      useFactory: (orderRepository: OrderRepository) =>
        new CreateOrderData(orderRepository),
    },
    {
      inject: [OrderRepository],
      provide: 'FindAllOrdersData',
      useFactory: (orderRepository: OrderRepository) =>
        new FindAllOrdersData(orderRepository),
    },
    {
      inject: [OrderRepository],
      provide: 'FindOrderByIdData',
      useFactory: (orderRepository: OrderRepository) =>
        new FindOrderByIdData(orderRepository),
    },
    {
      inject: [OrderRepository],
      provide: 'DeleteOrderData',
      useFactory: (orderRepository: OrderRepository) =>
        new DeleteOrderData(orderRepository),
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
