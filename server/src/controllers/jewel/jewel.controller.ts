import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

import { Response } from 'express';

import { CreateJewelDto } from '../../domain/dto/create-jewel.dto';
import { JewelDto } from '../../domain/dto/jewel.dto';
import { CreateJewelData } from '../../use_cases/jewel/create-jewel.data';
import { DeleteJewelData } from '../../use_cases/jewel/delete-jewel.data';
import { FindAllJewelData } from '../../use_cases/jewel/find-all-jewels.data';
import { FindJewelByIdData } from '../../use_cases/jewel/find-jewel-by-id.data';
import { UpdateJewelData } from '../../use_cases/jewel/update-jewel.data';

@Controller('jewels')
export class JewelController {
  constructor(
    private readonly findAllUseCase: FindAllJewelData,
    private readonly findByIdUseCase: FindJewelByIdData,
    private readonly createUseCase: CreateJewelData,
    private readonly updateUseCase: UpdateJewelData,
    private readonly deleteUseCase: DeleteJewelData
  ) {}

  @Get()
  find(@Res() res: Response): void {
    this.findAllUseCase.execute().then(
      (jewels) => {
        res.status(HttpStatus.OK).send(jewels);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Get('/:id')
  findById(@Param('id') id: string, @Res() res: Response): void {
    this.findByIdUseCase.execute(id).then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Post()
  create(@Res() res: Response, @Body() createJewelDto: CreateJewelDto): void {
    this.createUseCase.execute(createJewelDto).then(
      (jewel: JewelDto) => {
        res.status(HttpStatus.CREATED).send(jewel);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Put()
  update(@Res() res: Response, @Body() jewelDto: JewelDto): void {
    this.updateUseCase.execute(jewelDto).then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @Res() res: Response): void {
    this.deleteUseCase.execute(id).then(
      (result) => {
        res.status(HttpStatus.OK).send(result);
      },
      (error) => {
        res
          .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
          .send(error.error || error.message);
      },
    );
  }
}
