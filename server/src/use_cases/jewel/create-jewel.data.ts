import { CreateJewelDto } from '../../domain/dto/create-jewel.dto';
import { JewelDto } from '../../domain/dto/jewel.dto';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';

export class CreateJewelData {
  constructor(private readonly jewelRepository: JewelRepository) {}

  async execute(jewel: CreateJewelDto): Promise<JewelDto> {
    return this.jewelRepository.save(jewel);
  }
}
