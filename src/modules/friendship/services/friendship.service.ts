import { ForbiddenException, Injectable } from '@nestjs/common';

import { UserService } from 'src/modules/user/services/user.service';
import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Friendship } from '../entities/friendship.entity';
import { FriendshipStatus } from '../enums/friendship-status.enum';
import { friendshipRepository } from '../repositorys/friendship.repository';
import type { PaginateFriendshipsPayload } from '../dtos/paginate-friendships.dto';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly userService: UserService,
    private readonly paginationService: PaginationService,
  ) {}

  private createFriendshipQueryBuilder() {
    return friendshipRepository
      .createQueryBuilder('friendship')
      .select([
        'friendship.id',
        'friendship.initiator_id',
        'friendship.recipient_id',
        'friendship.blocked_by_id',
        'friendship.status',
        'friendship.created_at',
        'friendship.updated_at',
      ]);
  }

  private async isFriendshipValid(
    logged_in_user_id: string,
    user_to_be_friend_id: string,
  ) {
    const existingFriendship = await this.createFriendshipQueryBuilder()
      .where('friendship.initiator_id = :logged_in_user_id', {
        logged_in_user_id,
      })
      .andWhere('friendship.recipient_id = :user_to_be_friend_id', {
        user_to_be_friend_id,
      })
      .getOne();

    if (existingFriendship) {
      throw new ForbiddenException('Já existe uma amizade!');
    }
  }

  async paginateUserFriendships(
    user_id: string,
    {
      status,
      order_by_created_at,
      order_by_updated_at,
      limit,
      page,
    }: PaginateFriendshipsPayload,
  ) {
    const queryBuilder = this.createFriendshipQueryBuilder()
      .where(
        'friendship.initiator_id = :user_id OR friendship.recipient_id = :user_id',
        { user_id },
      )
      .andWhere(status ? 'friendship.status = :status' : '1=1', { status });

    if (order_by_created_at)
      queryBuilder.orderBy('friendship.created_at', order_by_created_at);

    if (order_by_updated_at)
      queryBuilder.orderBy('friendship.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(queryBuilder, {
      limit,
      page,
    });
  }

  async getFriendshipById(id: string): Promise<Friendship> {
    const friendship = await this.createFriendshipQueryBuilder()
      .where('friendship.id = :id', { id })
      .getOne();

    if (!friendship) {
      throw new NotFoundError('Amizade não encontrada');
    }

    return friendship;
  }

  async sendFriendshipSolicitation(
    logged_in_user_id: string,
    user_to_be_friend_id: string,
  ): Promise<Friendship> {
    if (logged_in_user_id === user_to_be_friend_id) {
      throw new ForbiddenException('Insira outro id!');
    }

    await Promise.all([
      this.isFriendshipValid(logged_in_user_id, user_to_be_friend_id),
      this.userService.getUserTotalFriendCount(logged_in_user_id),
      this.userService.getUserTotalFriendCount(user_to_be_friend_id),
    ]);

    const friendshipToCreate = friendshipRepository.create({
      initiator_id: logged_in_user_id,
      recipient_id: user_to_be_friend_id,
    });

    return friendshipRepository.save(friendshipToCreate);
  }

  async acceptFriendshipSolicitation(
    friendship_id: string,
    logged_in_user_id: string,
  ): Promise<Friendship> {
    const friendship = await this.getFriendshipById(friendship_id);

    if (logged_in_user_id !== friendship.recipient_id)
      throw new ForbiddenException('Não é vc que tem q aceitar!');

    friendship.status = FriendshipStatus.ACTIVE;

    await friendshipRepository.update(friendship_id, friendship);

    await this.updateUserFriendCounts(
      friendship.initiator_id,
      friendship.recipient_id,
      'increment',
    );

    return this.getFriendshipById(friendship_id);
  }

  async blockFriendship(
    friendship_id: string,
    logged_in_user_id: string,
  ): Promise<Friendship> {
    const friendship = await this.getFriendshipById(friendship_id);

    if (
      friendship.initiator_id !== logged_in_user_id &&
      friendship.recipient_id !== logged_in_user_id
    ) {
      throw new ForbiddenException('Não é vc que tem q bloquear!');
    }

    friendship.status = FriendshipStatus.BLOCKED;
    friendship.blocked_by_id = logged_in_user_id;

    await Promise.all([
      friendshipRepository.update(friendship_id, friendship),
      this.updateUserFriendCounts(
        friendship.initiator_id,
        friendship.recipient_id,
        'decrement',
      ),
    ]);

    return this.getFriendshipById(friendship_id);
  }

  async unblockFriendship(friendship_id: string, logged_in_user_id: string) {
    const friendshipToUnblock = await this.getFriendshipById(friendship_id);

    if (friendshipToUnblock.status !== FriendshipStatus.BLOCKED) {
      throw new ForbiddenException(
        'Cannot unblock friendship because it is not currently blocked.',
      );
    } else if (!friendshipToUnblock.blocked_by_id) {
      throw new ForbiddenException(
        'This friendship is not blocked by any user.',
      );
    } else if (friendshipToUnblock.blocked_by_id !== logged_in_user_id) {
      throw new ForbiddenException(
        'You are not authorized to unblock this friendship because you did not block it.',
      );
    }

    friendshipToUnblock.status = FriendshipStatus.ACTIVE;
    friendshipToUnblock.blocked_by_id = null;

    await Promise.all([
      friendshipRepository.update(friendship_id, friendshipToUnblock),
      this.updateUserFriendCounts(
        friendshipToUnblock.initiator_id,
        friendshipToUnblock.recipient_id,
        'increment',
      ),
    ]);

    return this.getFriendshipById(friendship_id);
  }

  private async updateUserFriendCounts(
    initiator_id: string,
    recipient_id: string,
    operation: 'increment' | 'decrement',
  ) {
    await Promise.all([
      this.userService.updateUserTotalFriendCount(initiator_id, operation),
      this.userService.updateUserTotalFriendCount(recipient_id, operation),
    ]);
  }
}
