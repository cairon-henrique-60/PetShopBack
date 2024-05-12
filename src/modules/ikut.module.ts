import { Global, Module } from '@nestjs/common';

import { PetModule } from './pet/pet.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PetSpeciesModule } from './pet-species/pet-species.module';

@Global()
@Module({
  imports: [AuthModule, UserModule, PetModule, PetSpeciesModule],
})
export class IKutModule {}
