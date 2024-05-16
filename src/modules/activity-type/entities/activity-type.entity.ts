import { Column, Entity, OneToMany } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { Activity } from 'src/modules/activity/entities/activity.entity';

import type { UpdateActivityTypePayload } from '../dtos/update-activity-type.dto';

@Entity('activity_types')
export class ActivityType extends Base {
  @Column('varchar')
  activity_name: string;

  @Column('varchar')
  activity_description: string;

  @OneToMany(() => Activity, (activity) => activity.activity_type)
  activities: Activity[];

  static update(payload: UpdateActivityTypePayload) {
    const itemToUpdate = new ActivityType();

    Object.assign(itemToUpdate, payload);

    return itemToUpdate;
  }
}
