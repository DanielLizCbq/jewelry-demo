import { OrderDto } from '../../domain/dto/order.dto';
import { OrderRepository } from '../../domain/repository/order/order.repository';

export class FindAllOrdersData {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(): Promise<OrderDto[]> {
    return this.orderRepository.findAll();
  }
}
