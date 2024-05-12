import { Column, Entity } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';

@Entity('pet_species')
export class PetSpecies extends Base {
  @Column('varchar')
  species_name: string;
}
