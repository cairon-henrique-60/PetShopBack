import { Module } from '@nestjs/common';

import { PetSpeciesService } from './services/pet-species.service';
import { PetSpeciesController } from './controllers/pet-species.controller';

const providers = [PetSpeciesService];

@Module({
  providers,
  exports: providers,
  controllers: [PetSpeciesController],
})
export class PetSpeciesModule {}
