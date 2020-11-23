import { CreateJewelDto } from '../../domain/dto/create-jewel.dto';
import { JewelDto } from '../../domain/dto/jewel.dto';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';

export class DeleteJewelData {
  constructor(private readonly jewelRepository: JewelRepository) {}

  async execute(id: string): Promise<DeleteJewelResDto> {
    return this.jewelRepository.delete(id);
  }
}

interface DeleteJewelResDto {
    message: string;
} 