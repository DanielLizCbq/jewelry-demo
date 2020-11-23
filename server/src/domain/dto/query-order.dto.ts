import { IsOptional, IsString } from "class-validator";

export class QueryOrderDto {
    @IsString()
    @IsOptional()
    id: string;
}