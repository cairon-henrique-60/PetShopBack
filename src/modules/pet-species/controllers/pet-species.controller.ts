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
  UseInterceptors,
} from '@nestjs/common';

import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';

import { DataBaseInterceptor } from 'src/lib/http-exceptions/errors/interceptors/database.interceptor';

import { PetSpecies } from '../entities/pet-species.entity';
import { PetSpeciesService } from '../services/pet-species.service';

import { ListSpeciesDTO } from '../dtos/list.dto';
import { CreateOrUpdateSpeciesDTO } from '../dtos/create-or-update-pet-species.dto';

@ApiTags('pet-species')
@Controller('pet-species')
export class PetSpeciesController {
  constructor(private readonly petSpeciesService: PetSpeciesService) {}

  @Public()
  @Get('list')
  async list(@Query() querys: ListSpeciesDTO): Promise<PetSpecies[]> {
    return this.petSpeciesService.list(querys);
  }

  @Public()
  @Post()
  @UseInterceptors(DataBaseInterceptor)
  async create(@Body() body: CreateOrUpdateSpeciesDTO): Promise<PetSpecies> {
    return this.petSpeciesService.createPetSpecies(body.species_name);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
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
