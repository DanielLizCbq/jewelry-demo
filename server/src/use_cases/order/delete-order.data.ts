import { OrderRepository } from '../../domain/repository/order/order.repository';

export class DeleteOrderData {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<DeleteOrderResDto> {
    return this.orderRepository.delete(id);
  }
}

interface DeleteOrderResDto {
  message: string;
}
