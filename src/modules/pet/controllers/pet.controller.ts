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
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';
import { DataBaseInterceptorDecorator } from 'src/shared/decorators/database-interceptor.decorator';

import { PetService } from '../services/pet.service';
import { CreatePetDTO } from '../dtos/create-pet.dto';
import { UpdatePetDTO } from '../dtos/update-pet.dto';
import { ListPetsQuerysDTO } from '../dtos/list-pets-querys.dto';
import { PaginatePetsQuerysDTO } from '../dtos/paginate-pets-querys.dto';

@ApiTags('pet')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get('paginate')
  @ApiPaginationQuery(orderByFields)
  async paginatePets(
    @Query() querys: PaginatePetsQuerysDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.petService.paginatePets(querys, decoded_token);
  }

  @Get('list')
  async getListPet(
    @Query() query: ListPetsQuerysDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.petService.list(query, decoded_token);
  }

  @Get(':id')
  async getPet(@UuidParam('id') id: string) {
    return this.petService.getPetById(id);
  }

  @Post()
  @DataBaseInterceptorDecorator()
  async createPet(
    @Body() payload: CreatePetDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.petService.createPet(payload, decoded_token.id);
  }

  @Put(':id')
  @DataBaseInterceptorDecorator()
  async updatePet(
    @UuidParam('id') id: string,
    @Body() payload: UpdatePetDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.petService.updatePet(id, decoded_token.id, payload);
  }

  @Delete(':id')
  async deletePet(
    @UuidParam('id') id: string,
    @DecodedToken() decodedToken: DecodedTokenType,
  ) {
    return this.petService.deletePet(id, decodedToken.id);
  }
}
