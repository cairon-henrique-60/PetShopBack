import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';

import { PetSpeciesService } from '../services/pet-species.service';
import { CreateOrUpdateSpeciesDTO } from '../dtos/create-or-update-pet-species.dto';

@ApiTags('pet-species')
@Controller('pet-species')
export class PetSpeciesController {
  constructor(private readonly petSpeciesService: PetSpeciesService) {}

  @Get()
  async getAll() {
    return this.petSpeciesService.getAllSpecies();
  }

  @Public()
  @Post()
  async create(@Body() body: CreateOrUpdateSpeciesDTO) {
    return this.petSpeciesService.createPetSpecies(body.species_name);
  }

  @Put(':id')
  async update(
    @UuidParam('id') id: string,
    @Body() body: CreateOrUpdateSpeciesDTO,
  ) {
    return this.petSpeciesService.updatePetSpecies(id, body.species_name);
  }

  @Delete(':id')
  async delete(@UuidParam('id') id: string) {
    return this.petSpeciesService.deletePetSpecies(id);
  }
}
