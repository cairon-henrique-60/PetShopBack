import { Module } from '@nestjs/common';

import { PetSpeciesService } from './services/pet-species.service';
import { petSpeciesProvider } from './providers/pet-species.provider';
import { PetSpeciesController } from './controllers/pet-species.controller';

@Module({
  providers: [...petSpeciesProvider, PetSpeciesService],
  exports: [...petSpeciesProvider, PetSpeciesService],
  controllers: [PetSpeciesController],
})
export class PetSpeciesModule {}
