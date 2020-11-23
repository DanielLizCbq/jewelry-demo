import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { Response } from 'express';
import { CreateOrderData } from 'src/use_cases/order/create-order.data';
import { DeleteOrderData } from 'src/use_cases/order/delete-order.data';
import { FindAllOrdersData } from 'src/use_cases/order/find-all-orders.data';
import { FindOrderByIdData } from 'src/use_cases/order/find-order-by-id.data';

import { CreateOrderDto } from '../../domain/dto/create-order.dto';
import { OrderDto } from '../../domain/dto/order.dto';
import { OrderRepository } from '../../domain/repository/order/order.repository';

@Controller('orders')
export class OrderController {
  constructor(private readonly findAllUseCase: FindAllOrdersData,
    private readonly findByIdUseCase: FindOrderByIdData,
    private readonly createUseCase: CreateOrderData,
    private readonly deleteUseCase: DeleteOrderData) {}

  @Get()
  find(@Res() res: Response): void {
      this.findAllUseCase.execute().then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Get('/:id')
  findById(@Param('id') id: string, @Res() res: Response): void {
    this.findByIdUseCase.execute(id).then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Post()
  create(@Res() res: Response, @Body() createOrderDto: CreateOrderDto): void {
    this.createUseCase.execute(createOrderDto).then(
      (order: OrderDto) => {
        res.status(HttpStatus.CREATED).send(order);
      },
      (error) => {
        console.log(error);
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Res() res: Response): void {
    this.deleteUseCase.execute(id).then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }
}
