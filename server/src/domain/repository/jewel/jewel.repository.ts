import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { throwError } from 'rxjs';

import { CreateJewelDto } from '../../../domain/dto/create-jewel.dto';
import { JewelDto } from '../../../domain/dto/jewel.dto';
import {
  Jewel,
  JewelDocument,
  JewelSchema,
} from '../../../domain/entities/jewel.entity';
import { BaseRepository } from '../base.repository';

export class JewelRepository implements BaseRepository {
  constructor(
    @InjectModel(Jewel.name) private jewelModel: Model<JewelDocument>,
  ) {}

  async findAll(): Promise<JewelDto[]> {
    const result = await this.jewelModel.find().exec();
    return result.map((j) => Jewel.dtoFromDocument(j));
  }

  async findById(id: string): Promise<JewelDto> {
    try {
      const result = await this.jewelModel.findById(id).exec();
      return Jewel.dtoFromDocument(result);
    } catch (error) {
      return throwError({
        status: HttpStatus.NOT_FOUND,
        error: { message: 'Jewel with id: ' + id + ' not found' },
      }).toPromise();
    }
  }

  async save(jewel: CreateJewelDto): Promise<JewelDto> {
    const doc: JewelDocument = await new this.jewelModel(jewel).save();
    return Jewel.dtoFromDocument(doc);
  }

  async update(jewel: JewelDto): Promise<JewelDto> {
    try {
      await this.findById(jewel.id);
      const result = this.jewelModel
        .updateOne({ _id: jewel.id }, { ...jewel, _id: jewel.id })
        .exec();
      return jewel;
    } catch (error) {
      return throwError({
        status: HttpStatus.NOT_FOUND,
        error: { message: 'Jewel with id: ' + jewel.id + ' not found' },
      }).toPromise();
      // throw new Error({});
    }
  }

  async delete(id: string): Promise<any> {
    const result = await this.jewelModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount > 0) {
      return { message: 'Jewel with id: ' + id + ' deleted' };
    } else {
      return throwError({
        status: HttpStatus.NOT_FOUND,
        error: { message: 'Jewel with id: ' + id + ' not found' },
      }).toPromise();
    }
  }
}
