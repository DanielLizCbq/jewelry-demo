import { HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateOrderDto } from '../../domain/dto/create-order.dto';
import { OrderDto } from '../../domain/dto/order.dto';
import { Order, OrderEntity } from '../../domain/entities/order.entity';
import { OrderRepository } from '../../domain/repository/order/order.repository';
import { CreateJewelDto } from '../../domain/dto/create-jewel.dto';
import { Jewel, JewelSchema } from '../../domain/entities/jewel.entity';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';
import { CreateJewelData } from '../jewel/create-jewel.data';
import { FindJewelByIdData } from '../jewel/find-jewel-by-id.data';
import { CreateOrderData } from './create-order.data';
import { DeleteOrderData } from './delete-order.data';
import { FindAllOrdersData } from './find-all-orders.data';
import { FindOrderByIdData } from './find-order-by-id.data';
import { connections, Mongoose } from 'mongoose';
import { error } from 'console';

describe('OrderTests', () => {
  let findAllOrdersUseCase: FindAllOrdersData;
  let createOrderUseCase: CreateOrderData;
  let findOrderByIdUseCase: FindOrderByIdData;
  let deleteOrderUseCase: DeleteOrderData;

  let createJewelUseCase: CreateJewelData;

  let idCreated: string;
  let idJewelCreated: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          `${process.env.DB_HOST || 'mongodb://localhost:27017/'}${
            process.env.DB_NAME || 'jewelry-test'
          }`,
        ),
        MongooseModule.forFeature([{ name: Jewel.name, schema: JewelSchema }]),
        MongooseModule.forFeature([{ name: Order.name, schema: OrderEntity }]),
      ],
      providers: [
        OrderRepository,
        JewelRepository,
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
        {
          inject: [JewelRepository],
          provide: 'CreateJewelData',
          useFactory: (jewelRepository: JewelRepository) =>
            new CreateJewelData(jewelRepository),
        },
        {
          inject: [JewelRepository],
          provide: 'FindJewelByIdData',
          useFactory: (jewelRepository: JewelRepository) =>
            new FindJewelByIdData(jewelRepository),
        },
      ],
    }).compile();
    findAllOrdersUseCase = module.get<FindAllOrdersData>(FindAllOrdersData);
    createOrderUseCase = module.get<CreateOrderData>(CreateOrderData);
    deleteOrderUseCase = module.get<DeleteOrderData>(DeleteOrderData);
    findOrderByIdUseCase = module.get<FindOrderByIdData>(FindOrderByIdData);

    createJewelUseCase = module.get<CreateJewelData>(CreateJewelData);

    const createDto = new CreateJewelDto();
    createDto.name = 'Jewel Test';
    createDto.costPrice = 10;
    const res = await createJewelUseCase.execute(createDto);
    idJewelCreated = res.id;
  });

  afterAll(async (done) => {
    for (let c of connections) {
      await c.close();
    }
    done();
  });

  it('should create order', async () => {
    let result: OrderDto;
    const createDto = new CreateOrderDto();
    createDto.products = [{ id: idJewelCreated, quantity: 1 }];
    try {
      result = await createOrderUseCase.execute(createDto);
      idCreated = result.id;
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(OrderDto);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products[0].jewel.id).toBe(idJewelCreated);
    expect(result.sellerCommission.toFixed(2)).toBe('0.70');
    expect(result.totalPrice).toBe(14);
  });

  it('should list a specific order', async () => {
    let result: OrderDto;
    try {
      result = await findOrderByIdUseCase.execute(idCreated);
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(OrderDto);
    expect(result.id).toBe(idCreated);
  });

  it('should not found order', async () => {
    let error;
    const id = '111';
    try {
      await findOrderByIdUseCase.execute(id);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(HttpStatus.NOT_FOUND);
    expect(error.error.message).toBe(`Order with id: ${id} not found`);
  });

  it('should list all orders', async () => {
    let result: Array<OrderDto>;
    try {
      result = await findAllOrdersUseCase.execute();
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    const find = result.find((j) => j.id === idCreated);
    expect(find).toBeDefined();
  });

  it('should delete Order', async () => {
    let result: { message: string };
    try {
      result = await deleteOrderUseCase.execute(idCreated);
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result.message).toBe(`Order with id: ${idCreated} deleted`);
  });
});
