import { JewelDto } from '../../domain/dto/jewel.dto';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';

export class UpdateJewelData {
  constructor(private readonly jewelRepository: JewelRepository) {}

  async execute(jewel: JewelDto): Promise<JewelDto> {
    return this.jewelRepository.update(jewel);
  }
}
