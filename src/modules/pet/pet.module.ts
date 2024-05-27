import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { PetBreedModule } from '../pet-breed/pet-breed.module';
import { PetSpeciesModule } from '../pet-species/pet-species.module';

import { PetService } from './services/pet.service';
import { PetController } from './controllers/pet.controller';

const providers = [PetService];

@Module({
  providers,
  exports: providers,
  controllers: [PetController],
  imports: [PetSpeciesModule, PetBreedModule, UserModule],
})
export class PetModule {}
