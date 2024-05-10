import { Entity, Column, Index } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';

@Entity('users')
export class User extends Base {
  @Index()
  @Column('varchar')
  user_name: string;

  @Column({ length: 255 })
  hashed_password: string;
 
  @Column('varchar')
  user_email: string;
}
