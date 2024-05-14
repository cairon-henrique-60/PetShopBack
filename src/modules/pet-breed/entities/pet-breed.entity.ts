import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';

@Entity('pet_breeds')
export class PetBreed extends Base {
  @Column('varchar')
  breed_name: string;

  @Column('uuid')
  @Index()
  species_id: string;

  @ManyToOne(() => PetSpecies, { eager: true })
  @JoinColumn({ name: 'species_id' })
  species: PetSpecies;
}
