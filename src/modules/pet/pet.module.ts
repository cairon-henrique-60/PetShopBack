import { Module } from '@nestjs/common';

import { PetSpeciesService } from '../pet-species/services/pet-species.service';

import { PetBreedService } from '../pet-breed/services/pet-breed.service';

import { UserService } from '../user/services/user.service';

import { PetService } from './services/pet.service';
import { petProvider } from './providers/pet.provider';
import { PetController } from './controllers/pet.controller';
import { PetSpeciesModule } from '../pet-species/pet-species.module';
import { PetBreedModule } from '../pet-breed/pet-breed.module';
import { UserModule } from '../user/user.module';

const providers = [...petProvider, PetService]

@Module({
  providers,
  exports: providers,
  controllers: [PetController],
  imports: [PetSpeciesModule, PetBreedModule, UserModule]
})
export class PetModule {}
