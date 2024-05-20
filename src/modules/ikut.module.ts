import { Global, Module } from '@nestjs/common';

import { PetModule } from './pet/pet.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoogleModule } from './google/google.module';
import { CalendarModule } from './calendar/calendar.module';
import { PetBreedModule } from './pet-breed/pet-breed.module';
import { PetSpeciesModule } from './pet-species/pet-species.module';

@Global()
@Module({
  imports: [
    AuthModule,
    UserModule,
    PetModule,
    PetSpeciesModule,
    PetBreedModule,
    MailModule,
    GoogleModule,
    CalendarModule,
  ],
})
export class IKutModule {}
