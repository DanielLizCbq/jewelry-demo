import { HttpStatus } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { connections } from 'mongoose';

import { CreateJewelDto } from '../../domain/dto/create-jewel.dto';
import { JewelDto } from '../../domain/dto/jewel.dto';
import { Jewel, JewelSchema } from '../../domain/entities/jewel.entity';
import { JewelRepository } from '../../domain/repository/jewel/jewel.repository';
import { CreateJewelData } from './create-jewel.data';
import { DeleteJewelData } from './delete-jewel.data';
import { FindAllJewelData } from './find-all-jewels.data';
import { FindJewelByIdData } from './find-jewel-by-id.data';
import { UpdateJewelData } from './update-jewel.data';

describe('JewelTests', () => {
  let findAllJewelUseCase: FindAllJewelData;
  let createJewelUseCase: CreateJewelData;
  let findJewelByIdUseCase: FindJewelByIdData;
  let deleteJewelUseCase: DeleteJewelData;
  let updateJewelUseCase: UpdateJewelData;

  let idCreated: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(`${process.env.DB_HOST || 'mongodb://localhost:27017/'}${process.env.DB_NAME || 'jewelry-test'}`),
        MongooseModule.forFeature([{ name: Jewel.name, schema: JewelSchema }]),
      ],
      providers: [
        JewelRepository,
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
      ],
    }).compile();
    findAllJewelUseCase = module.get<FindAllJewelData>(FindAllJewelData);
    findJewelByIdUseCase = module.get<FindJewelByIdData>(FindJewelByIdData);
    createJewelUseCase = module.get<CreateJewelData>(CreateJewelData);
    deleteJewelUseCase = module.get<DeleteJewelData>(DeleteJewelData);
    updateJewelUseCase = module.get<UpdateJewelData>(UpdateJewelData);
  });

  afterAll(async (done) => {
    for(let c of connections) {
      await c.close()
    }
    done();
  });

  it('should create jewel', async () => {
    let result: JewelDto;
    const createDto = new CreateJewelDto();
    createDto.name = 'Jewel Test';
    createDto.costPrice = 15;
    try {
      result = await createJewelUseCase.execute(createDto);
      idCreated = result.id;
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(JewelDto);
    expect(
      JSON.stringify({
        name: result.name,
        costPrice: result.costPrice,
      }),
    ).toBe(
      JSON.stringify({
        name: createDto.name,
        costPrice: createDto.costPrice,
      }),
    );
  });

  it('should list a specific jewel', async () => {
    let result: JewelDto;
    try {
      result = await findJewelByIdUseCase.execute(idCreated);
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(JewelDto);
    expect(result.id).toBe(idCreated);
  });

  it('should not found jewel', async () => {
    let error;
    const id = '111';
    try {
      await findJewelByIdUseCase.execute(id);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
    expect(error.status).toBe(HttpStatus.NOT_FOUND);
    expect(error.error.message).toBe(`Jewel with id: ${id} not found`);
  });

  it('should update a specific jewel', async () => {
    let result: JewelDto;
    const updateDto = new JewelDto();
    updateDto.id = idCreated;
    updateDto.name = 'Jewel Test Update';
    updateDto.costPrice = 25;
    try {
      result = await updateJewelUseCase.execute(updateDto);
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(JewelDto);
    expect(
      JSON.stringify({
        name: result.name,
        costPrice: result.costPrice,
      }),
    ).toBe(
      JSON.stringify({
        name: updateDto.name,
        costPrice: updateDto.costPrice,
      }),
    );
  });

  it('should list all jewel', async () => {
    let result: Array<JewelDto>;
    try {
      result = await findAllJewelUseCase.execute();
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Array);
    const find = result.find(j => j.id === idCreated);
    expect(find).toBeDefined();
  });

  it('should delete jewel', async () => {
    let result: { message: string };
    try {
      result = await deleteJewelUseCase.execute(idCreated);
    } catch (e) {}
    expect(result).toBeDefined();
    expect(result.message).toBe(`Jewel with id: ${idCreated} deleted`);
  });
});
