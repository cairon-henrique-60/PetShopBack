import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Pet } from 'src/modules/pet/entities/pet.entity';
import { Base } from 'src/lib/database/entities/base.entity';
import { ActivityType } from 'src/modules/activity-type/entities/activity-type.entity';

import type { UpdateActivityPayload } from '../dtos/update-activity.dto';

@Entity('activities')
export class Activity extends Base {
  @Column('varchar')
  activity_title: string;

  @Column('varchar')
  activity_description: string;

  @Column('varchar')
  activity_location: string;

  @Column('date')
  activity_date: Date;

  @Column('time with time zone')
  activity_time: string;

  @Column('uuid')
  pet_id: string;

  @Column('uuid')
  activity_type_id: string;

  @ManyToOne(() => Pet, (pet) => pet.activities, { eager: true })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @ManyToOne(() => ActivityType, (activity_type) => activity_type.activities, {
    eager: true,
  })
  @JoinColumn({ name: 'activity_type_id' })
  activity_type: ActivityType;

  static update(payload: UpdateActivityPayload) {
    const itemToUpdate = new Activity();

    Object.assign(itemToUpdate, payload);

    return itemToUpdate;
  }
}
