import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, Min } from 'class-validator';
import { JewelDto } from '../../domain/dto/jewel.dto';

class ProductDto {
  @Type(() => JewelDto)
  jewel: JewelDto;

  @Type(() => Number)
  @Min(0)
  quantity: number;

  @Type(() => Number)
  @Min(0)
  costPriceAtPurchase: number;
}

export class OrderDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @Type(() => JewelDto)
  products: ProductDto[];

  @IsDate()
  createdAt: Date;

  @Type(() => Number)
  @Min(0)
  totalPrice: number;

  @Type(() => Number)
  @Min(0)
  sellerCommission: number;

}
