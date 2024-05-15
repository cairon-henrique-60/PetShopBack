import { Global, Module } from '@nestjs/common';

import { PetModule } from './pet/pet.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PetBreedModule } from './pet-breed/pet-breed.module';
import { PetSpeciesModule } from './pet-species/pet-species.module';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [
    AuthModule,
    UserModule,
    PetModule,
    PetSpeciesModule,
    PetBreedModule,
    MailModule,
  ],
})
export class IKutModule {}
