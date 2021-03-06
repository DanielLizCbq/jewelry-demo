import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, Min } from 'class-validator';

export class JewelDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @Min(0)
  costPrice: number;
}
