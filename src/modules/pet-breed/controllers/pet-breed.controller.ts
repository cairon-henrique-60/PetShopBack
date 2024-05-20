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
import { ApiTags } from '@nestjs/swagger';

import { orderByFields } from 'src/config/swagger.config';
import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { PetBreedService } from '../services/pet-breed.service';
import { CreatePetBreedDTO } from '../dtos/create-pet-breed.dto';
import { UpdatePetBreedDTO } from '../dtos/update-pet-breed.dto';
import { PaginatePetBreedDTO } from '../dtos/paginate-pet-breed.dto';
import { DataBaseInterceptor } from 'src/lib/http-exceptions/errors/interceptors/database.interceptor';

@ApiTags('pet-breed')
@Controller('pet-breed')
export class PetBreedController {
  constructor(private readonly petBreedService: PetBreedService) {}

  @Public()
  @ApiPaginationQuery(orderByFields)
  @Get('paginate')
  async paginateBreeds(@Query() querys: PaginatePetBreedDTO) {
    return this.petBreedService.paginateBreeds(querys);
  }

  @Public()
  @Get(':id')
  async getPetBreedById(@UuidParam('id') id: string) {
    return this.petBreedService.getBreedById(id);
  }

  @Public()
  @Get('breeds-by-species/:species_id')
  async getBreedsBySpeciesId(@UuidParam('species_id') species_id: string) {
    return this.petBreedService.getBreedsBySpeciesId(species_id);
  }

  @Public()
  @Post()
  @UseInterceptors(DataBaseInterceptor)
  async createBreed(@Body() payload: CreatePetBreedDTO) {
    return this.petBreedService.createPetBreed(payload);
  }

  @Put(':id')
  @UseInterceptors(DataBaseInterceptor)
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
