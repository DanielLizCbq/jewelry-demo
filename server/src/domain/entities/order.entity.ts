import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Timestamp } from 'rxjs';
import { Jewel, JewelDocument } from '../../domain/entities/jewel.entity';
import { JewelDto } from '../dto/jewel.dto';
import { OrderDto } from '../dto/order.dto';

export type OrderDocument = Order & Document;

class Product {
  @Prop({ type: Types.ObjectId, ref: Jewel.name })
  jewel: JewelDocument;

  @Prop()
  quantity: number;

  @Prop() // Caso o preço seja atualizado
  costPriceAtPurchase: number;

  // @Prop() // Caso o nome seja atualizado
  // nameAtPurchase: string;
}

@Schema()
export class Order {
  @Prop()
  products: Product[];

  @Prop()
  createdAt: Date;

  @Prop()
  totalPrice: number;

  @Prop()
  sellerCommission: number;

  static toDtoSave(doc: Order): OrderDto {
    const dto = new OrderDto();

    dto.products = doc.products.map((p) => {
      return {
        ...p,
        jewel: p.jewel.id,
      };
    });

    dto.createdAt = doc.createdAt;
    dto.sellerCommission = doc.sellerCommission;
    dto.totalPrice = doc.totalPrice;

    return dto;
  }

  static toDtoFromOrder(doc: Order): OrderDto {
    const dto = new OrderDto();

    dto.products = doc.products.map((p) => {
      return {
        ...p,
        jewel: Jewel.dtoFromDocument(p.jewel),
      };
    });

    dto.createdAt = doc.createdAt;
    dto.sellerCommission = doc.sellerCommission;
    dto.totalPrice = doc.totalPrice;

    return dto;
  }

  static toDtoFromDocument(doc: OrderDocument): OrderDto {
    const dto = new OrderDto();

    dto.products = doc.products.map((p) => {
      return {
        ...p,
        jewel: Jewel.dtoFromDocument(p.jewel),
      };
    });

    dto.createdAt = doc.createdAt;
    dto.sellerCommission = doc.sellerCommission;
    dto.totalPrice = doc.totalPrice;
    dto.id = doc.id;

    return dto;
  }
}

export const OrderEntity = SchemaFactory.createForClass(Order);
