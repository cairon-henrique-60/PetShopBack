import { Module } from '@nestjs/common';

import { PetService } from './services/pet.service';
import { petProvider } from './providers/pet.provider';
import { PetController } from './controllers/pet.controller';

@Module({
  providers: [...petProvider, PetService],
  exports: [...petProvider, PetService],
  controllers: [PetController],
})
export class PetModule {}
