import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Pet } from 'src/modules/pet/entities/pet.entity';

import type { CreateCalendarPayload } from '../dtos/create-calendar.dto';
import type { UpdateCalendarPayload } from '../dtos/update-calendar.dto';

@Entity('calendars')
export class Calendar extends Base {
  @Index()
  @Column('varchar')
  description: string;

  @Column('timestamp')
  initial_date: Date;

  @Column('timestamp')
  end_date: Date;

  @Index()
  @Column('uuid')
  pet_id: string;

  @Index()
  @Column('uuid')
  user_id: string;

  @Column('varchar', { nullable: true })
  location: NullableValue<string>;

  @Column('timestamp')
  notification_date: Date;

  @ManyToOne(() => User, (user) => user.calendars, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.calendars, { eager: true })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  static create(
    payload: CreateCalendarPayload & { user_id: string },
  ): Calendar {
    const item = new Calendar();

    Object.assign(item, payload);

    return item;
  }

  static update(payload: UpdateCalendarPayload): Calendar {
    const item = new Calendar();

    Object.assign(item, payload);

    return item;
  }
}
