import { DeleteResult } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { ListSpeciesDTO } from '../dtos/list-species.dto';
import { PetSpecies } from '../entities/pet-species.entity';
import { PetSpeciesService } from '../services/pet-species.service';
import { CreateOrUpdateSpeciesDTO } from '../dtos/create-or-update-pet-species.dto';

@ApiTags('pet-species')
@Controller('pet-species')
export class PetSpeciesController {
  constructor(private readonly petSpeciesService: PetSpeciesService) {}

  @Get('list')
  async list(@Query() querys: ListSpeciesDTO): Promise<PetSpecies[]> {
    return this.petSpeciesService.list(querys);
  }

  @Post()
  @DataBaseInterceptorDecorator()
  async create(@Body() body: CreateOrUpdateSpeciesDTO): Promise<PetSpecies> {
    return this.petSpeciesService.createPetSpecies(body.species_name);
  }

  @Put(':id')
  @DataBaseInterceptorDecorator()
  async update(
    @UuidParam('id') id: string,
    @Body() body: CreateOrUpdateSpeciesDTO,
  ): Promise<PetSpecies> {
    return this.petSpeciesService.updatePetSpecies(id, body.species_name);
  }

  @Delete(':id')
  async delete(@UuidParam('id') id: string): Promise<DeleteResult> {
    return this.petSpeciesService.deletePetSpecies(id);
  }
}
