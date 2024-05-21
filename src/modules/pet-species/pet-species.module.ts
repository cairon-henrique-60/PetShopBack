import { Module } from '@nestjs/common';

import { PetSpeciesService } from './services/pet-species.service';
import { petSpeciesProvider } from './providers/pet-species.provider';
import { PetSpeciesController } from './controllers/pet-species.controller';

const providers = [...petSpeciesProvider, PetSpeciesService];

@Module({
  providers,
  exports: providers,
  controllers: [PetSpeciesController],
})
export class PetSpeciesModule {}
