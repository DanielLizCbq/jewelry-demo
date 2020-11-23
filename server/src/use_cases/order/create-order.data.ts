import { CreateOrderDto } from '../../domain/dto/create-order.dto';
import { OrderDto } from '../../domain/dto/order.dto';
import { OrderRepository } from '../../domain/repository/order/order.repository';

export class CreateOrderData {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(order: CreateOrderDto): Promise<OrderDto> {
    return this.orderRepository.save(order);
  }
}
