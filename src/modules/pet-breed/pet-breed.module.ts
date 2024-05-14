import { Module } from '@nestjs/common';

import { PetBreedService } from './services/pet-breed.service';
import { petBreedProvider } from './providers/pet-breed.provider';
import { PetBreedController } from './controllers/pet-breed.controller';
import { PetSpeciesModule } from '../pet-species/pet-species.module';

const providers = [...petBreedProvider, PetBreedService];

@Module({
  exports: providers,
  providers,
  controllers: [PetBreedController],
  imports: [PetSpeciesModule],
})
export class PetBreedModule {}
