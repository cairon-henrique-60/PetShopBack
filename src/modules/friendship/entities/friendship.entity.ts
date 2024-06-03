import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { Base } from 'src/lib/database/entities/base.entity';
import { User } from 'src/modules/user/entities/user.entity';

import { FriendshipStatus } from '../enums/friendship-status.enum';

@Entity('friendships')
export class Friendship extends Base {
  @Index()
  @Column('uuid')
  initiator_id: string; // The ID of the user who initiated the friendship.

  @Index()
  @Column('uuid')
  recipient_id: string; // The ID of the user who received the friendship request.

  @Column('uuid', { nullable: true, default: null })
  blocked_by_id: NullableValue<string>;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus; // The status of the friendship (active, blocked).

  @ManyToOne(() => User)
  @JoinColumn({ name: 'initiator_id' })
  initiator: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'blocked_by_id' })
  blocked_by: NullableValue<User>;
}
