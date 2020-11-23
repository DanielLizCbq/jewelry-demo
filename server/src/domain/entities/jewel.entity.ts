import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JewelDto } from '../dto/jewel.dto';

export type JewelDocument = Jewel & Document;

@Schema()
export class Jewel {
  @Prop()
  name: string;

  @Prop()
  costPrice: number;

  static dtoFromDocument(jewel: JewelDocument): JewelDto {
    const dto = new JewelDto();
    dto.id = jewel.id || jewel;
    dto.name = jewel.name || null;
    dto.costPrice = jewel.costPrice || null;
    return dto;
  }
}

export const JewelSchema = SchemaFactory.createForClass(Jewel);
