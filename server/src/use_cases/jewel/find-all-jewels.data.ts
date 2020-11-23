import { JewelDto } from '../../domain/dto/jewel.dto';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';

export class FindAllJewelData {
  constructor(private readonly jewelRepository: JewelRepository) {}

  async execute(): Promise<JewelDto[]> {
    return this.jewelRepository.findAll();
  }
}
