import { OrderDto } from '../../domain/dto/order.dto';
import { OrderRepository } from '../../domain/repository/order/order.repository';

export class FindOrderByIdData {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<OrderDto> {
    return this.orderRepository.findById(id);
  }
}
