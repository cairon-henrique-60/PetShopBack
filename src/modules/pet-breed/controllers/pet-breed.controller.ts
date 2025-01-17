import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { orderByFields } from 'src/config/swagger.config';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { ListPetBreedDTO } from '../dtos/list-pet-breed.dto';
import { PetBreedService } from '../services/pet-breed.service';
import { CreatePetBreedDTO } from '../dtos/create-pet-breed.dto';
import { UpdatePetBreedDTO } from '../dtos/update-pet-breed.dto';
import { PaginatePetBreedDTO } from '../dtos/paginate-pet-breed.dto';

@ApiTags('pet-breed')
@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) {}

  @ApiPaginationQuery(orderByFields)
  @Get('paginate')
  async paginateBreeds(@Query() querys: PaginatePetBreedDTO) {
    return this.petBreedService.paginateBreeds(querys);
  }

  @Get('list')
  async listBreeds(@Query() querys: ListPetBreedDTO) {
    return this.petBreedService.list(querys);
  }

  @Get(':id')
  async getPetBreedById(@UuidParam('id') id: string) {
    return this.petBreedService.getBreedById(id);
  }

  @Get('breeds-by-species/:species_id')
  async getBreedsBySpeciesId(@UuidParam('species_id') species_id: string) {
    return this.petBreedService.getBreedsBySpeciesId(species_id);
  }

  @Post()
  @DataBaseInterceptorDecorator()
  async createBreed(@Body() payload: CreatePetBreedDTO) {
    return this.petBreedService.createPetBreed(payload);
  }

  @Put(':id')
  @DataBaseInterceptorDecorator()
  async updateBreed(
    @UuidParam('id') id: string,
    @Body() payload: UpdatePetBreedDTO,
  ) {
    return this.petBreedService.updatePetBreed(id, payload);
  }

  @Delete(':id')
  async deleteBreed(@UuidParam('id') id: string) {
    return this.petBreedService.deletePetBreed(id);
  }
}
