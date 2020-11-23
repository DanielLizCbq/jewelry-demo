import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { throwError } from 'rxjs';

import { CreateOrderDto } from '../../../domain/dto/create-order.dto';
import { Order, OrderDocument } from '../../../domain/entities/order.entity';
import { BaseRepository } from '../base.repository';
import { OrderDto } from '../../../domain/dto/order.dto';
import { JewelDocument } from '../../../domain/entities/jewel.entity';
import { FindJewelByIdData } from '../../../use_cases/jewel/find-jewel-by-id.data';

export class OrderRepository implements BaseRepository {
  private commissionPercentage: number = 0.05;
  private minValueToHaveDiscount: number = 5000;
  private profitPercentage: number = 0.4;
  private profitDiscountPercentage: number = 0.3;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private findJewelUseCase: FindJewelByIdData,
  ) {}

  async findAll(): Promise<OrderDto[]> {
    const result: OrderDocument[] = await this.orderModel
      .find()
      .populate({ path: 'products.jewel', model: 'Jewel' })
      .exec();
    return result.map((o) => Order.toDtoFromDocument(o));
  }

  async findById(id: string): Promise<OrderDto> {
    try{
      const doc: OrderDocument = await this.orderModel
        .findById(id)
        .populate({ path: 'products.jewel', model: 'Jewel' })
        .exec();
      return Order.toDtoFromDocument(doc);
    } catch (err) {
      return throwError({
        status: HttpStatus.NOT_FOUND,
        error: { message: 'Order with id: ' + id + ' not found' },
      }).toPromise();
    }
  }

  async save(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const order = await this.buildOrder(createOrderDto);
    const dto = Order.toDtoFromOrder(order);
    const doc: OrderDocument = await new this.orderModel(
      Order.toDtoSave(order),
    ).save();
    dto.id = doc.id;
    return dto;
  }

  async delete(id: string): Promise<any> {
    const result = await this.orderModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount > 0) {
      return { message: 'Order with id: ' + id + ' deleted' };
    } else {
      return throwError({
        status: HttpStatus.NOT_FOUND,
        error: { message: 'Order with id: ' + id + ' not found' },
      }).toPromise();
    }
  }

  private async buildOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order: Order = new Order();
    order.totalPrice = 0;
    order.products = [];
    for (let prod of createOrderDto.products) {
      const product = await this.findJewelUseCase.execute(prod.id);
      order.products.push({
        jewel: product as JewelDocument,
        costPriceAtPurchase: product.costPrice,
        quantity: prod.quantity,
      });
      order.totalPrice += product.costPrice * prod.quantity;
    }
    if (order.totalPrice >= this.minValueToHaveDiscount) {
      order.totalPrice += order.totalPrice * this.profitDiscountPercentage;
    } else {
      order.totalPrice += order.totalPrice * this.profitPercentage;
    }
    order.sellerCommission = order.totalPrice * this.commissionPercentage;
    order.createdAt = new Date();
    return order;
  }
}
