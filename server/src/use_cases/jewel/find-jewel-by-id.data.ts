import { JewelDto } from '../../domain/dto/jewel.dto';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';

export class FindJewelByIdData {
  constructor(private readonly jewelRepository: JewelRepository) {}

  async execute(id: string): Promise<JewelDto> {
    return this.jewelRepository.findById(id);
  }
}
