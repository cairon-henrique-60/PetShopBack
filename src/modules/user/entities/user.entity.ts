import { Entity, Column, Index, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { Pet } from 'src/modules/pet/entities/pet.entity';

@Entity('users')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column({ length: 255 })
  hashed_password: string;
 
  @Column('varchar')
  user_email: string;

  @OneToMany(() => Pet, pet => pet.tutor)
  pets: Pet[]
}
