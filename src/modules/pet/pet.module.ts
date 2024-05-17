import { Module } from '@nestjs/common';

import { PetSpeciesService } from '../pet-species/services/pet-species.service';
import { petSpeciesProvider } from '../pet-species/providers/pet-species.provider';

import { PetBreedService } from '../pet-breed/services/pet-breed.service';
import { petBreedProvider } from '../pet-breed/providers/pet-breed.provider';

import { UserService } from '../user/services/user.service';
import { userProvider } from '../user/providers/user.provider';

import { PetService } from './services/pet.service';
import { petProvider } from './providers/pet.provider';
import { PetController } from './controllers/pet.controller';
@Module({
  providers: [
    ...petProvider,
    PetService,
    ...userProvider,
    UserService,
    ...petSpeciesProvider,
    PetSpeciesService,
    ...petBreedProvider,
    PetBreedService,
  ],
  exports: [...petProvider, PetService],
  controllers: [PetController],
})
export class PetModule {}
