import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, Min, ValidateNested } from "class-validator";

class ProductDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @Type(() => Number)
    @Min(0)
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDto)
    @ArrayMinSize(1)
    products: ProductDto[];

}