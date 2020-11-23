import { IsString } from "class-validator";

export class QueryJewelDto {
    @IsString()
    id: string;
}