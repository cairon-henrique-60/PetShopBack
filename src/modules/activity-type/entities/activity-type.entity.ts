import { Column, Entity } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';

import type { UpdateActivityTypePayload } from '../dtos/update-activity-type.dto';

@Entity('activity_types')
export class ActivityType extends Base {
  @Column('varchar')
  activity_name: string;

  @Column('varchar')
  activity_description: string;

  static update(payload: UpdateActivityTypePayload) {
    const itemToUpdate = new ActivityType();

    Object.assign(itemToUpdate, payload);

    return itemToUpdate;
  }
}
