import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JewelController } from './jewel.controller';

import { Jewel, JewelSchema } from '../../domain/entities/jewel.entity';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';
import { CreateJewelData } from '../../use_cases/jewel/create-jewel.data';
import { FindAllJewelData } from '../../use_cases/jewel/find-all-jewels.data';
import { FindJewelByIdData } from '../../use_cases/jewel/find-jewel-by-id.data';
import { UpdateJewelData } from '../../use_cases/jewel/update-jewel.data';
import { DeleteJewelData } from '../../use_cases/jewel/delete-jewel.data';

@Module({
  controllers: [JewelController],
  imports: [
    MongooseModule.forFeature([{ name: Jewel.name, schema: JewelSchema }]),
  ],
  providers: [
    {
      inject: [JewelRepository],
      provide: 'CreateJewelData',
      useFactory: (jewelRepository: JewelRepository) =>
        new CreateJewelData(jewelRepository),
    },
    {
      inject: [JewelRepository],
      provide: 'UpdateJewelData',
      useFactory: (jewelRepository: JewelRepository) =>
        new UpdateJewelData(jewelRepository),
    },
    {
      inject: [JewelRepository],
      provide: 'FindAllJewelData',
      useFactory: (jewelRepository: JewelRepository) =>
        new FindAllJewelData(jewelRepository),
    },
    {
      inject: [JewelRepository],
      provide: 'FindJewelByIdData',
      useFactory: (jewelRepository: JewelRepository) =>
        new FindJewelByIdData(jewelRepository),
    },
    {
      inject: [JewelRepository],
      provide: 'DeleteJewelData',
      useFactory: (jewelRepository: JewelRepository) =>
        new DeleteJewelData(jewelRepository),
    },
    JewelRepository,
  ],
  exports: [JewelRepository, FindJewelByIdData],
})
export class JewelModule {}
