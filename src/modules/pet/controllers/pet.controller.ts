import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { PetService } from '../services/pet.service';
import { CreatePetDTO } from '../dtos/create-pet.dto';
import { PaginatePetsQuerysDTO } from '../dtos/paginate-pets-querys.dto';

@ApiTags('pet')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Public()
  @Get('paginate')
  @ApiPaginationQuery()
  async paginatePets(@Query() querys: PaginatePetsQuerysDTO) {
    return this.petService.paginatePets(querys);
  }

  @Post()
  async createPet(@Body() payload: CreatePetDTO) {
    return this.petService.createPet(payload);
  }

  @Delete(':id')
  async deletePet(
    @UuidParam('id') id: string,
    @DecodedToken() decodedToken: DecodedTokenType,
  ) {
    return this.petService.deletePet(id, decodedToken.id);
  }
}
