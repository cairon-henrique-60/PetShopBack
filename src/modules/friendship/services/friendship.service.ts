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
        'friendship.status',
        'friendship.created_at',
        'friendship.updated_at',
      ]);
  }

  private async isFriendshipValid(
    logged_in_user_id: string,
    user_to_be_friend_id: string,
  ) {
    const friendship = await this.createFriendshipQueryBuilder()
      .where('friendship.initiator_id = :logged_in_user_id', {
        logged_in_user_id,
      })
      .andWhere('friendship.recipient_id = :user_to_be_friend_id', {
        user_to_be_friend_id,
      })
      .getOne();

    if (friendship) throw new ForbiddenException('Já existe uma amizade!');
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
      queryBuilder.orderBy('friendship.created_at', order_by_updated_at);

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
    if (logged_in_user_id === user_to_be_friend_id)
      throw new ForbiddenException('Insira outro id!');

    await Promise.all([
      this.userService.getUserTotalFriendCount(logged_in_user_id),
      this.userService.getUserTotalFriendCount(user_to_be_friend_id),
      this.isFriendshipValid(logged_in_user_id, user_to_be_friend_id),
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

    await Promise.all([
      friendshipRepository.update(friendship_id, friendship),
      this.userService.updateUserTotalFriendCount(
        friendship.initiator_id,
        'increment',
      ),
      this.userService.updateUserTotalFriendCount(
        friendship.recipient_id,
        'increment',
      ),
    ]);

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
    )
      throw new ForbiddenException('Não é vc que tem q bloquear!');

    friendship.status = FriendshipStatus.BLOCKED;

    await Promise.all([
      friendshipRepository.update(friendship_id, friendship),
      this.userService.updateUserTotalFriendCount(
        friendship.initiator_id,
        'decrement',
      ),
      this.userService.updateUserTotalFriendCount(
        friendship.recipient_id,
        'decrement',
      ),
    ]);

    return this.getFriendshipById(friendship_id);
  }
}
