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
import { Public } from 'src/shared/decorators/auth.decorator';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { PetService } from '../services/pet.service';
import { CreatePetDTO } from '../dtos/create-pet.dto';
import { UpdatePetDTO } from '../dtos/update-pet.dto';
import { PaginatePetsQuerysDTO } from '../dtos/paginate-pets-querys.dto';

@ApiTags('pet')
@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Public()
  @Get('paginate')
  @ApiPaginationQuery(orderByFields)
  async paginatePets(@Query() querys: PaginatePetsQuerysDTO) {
    return this.petService.paginatePets(querys);
  }

  @Get(':id')
  async getPet(@UuidParam('id') id: string) {
    return this.petService.getPet(id);
  }

  @Post()
  async createPet(@Body() payload: CreatePetDTO) {
    return this.petService.createPet(payload);
  }

  @Put(':id')
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
