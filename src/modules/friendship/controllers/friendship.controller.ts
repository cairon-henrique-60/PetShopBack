import { Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { orderByFields } from 'src/config/swagger.config';
import { UuidParam } from 'src/shared/decorators/uuid-param.decorator';
import { DecodedToken } from 'src/shared/decorators/decoded-token.decorator';
import { ApiPaginationQuery } from 'src/shared/decorators/api-pagination-query.decorator';

import { FriendshipService } from '../services/friendship.service';
import { PaginateFriendshipsDTO } from '../dtos/paginate-friendships.dto';

@ApiTags('friendship')
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get('paginate')
  @ApiPaginationQuery(orderByFields)
  async paginate(
    @Query() querys: PaginateFriendshipsDTO,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.friendshipService.paginateUserFriendships(
      decoded_token.id,
      querys,
    );
  }

  @Post('send-solicitation/:user_to_be_friend_id')
  async send(
    @UuidParam('user_to_be_friend_id') user_to_be_friend_id: string,
    @DecodedToken() decoded_token: DecodedTokenType,
  ) {
    return this.friendshipService.sendFriendshipSolicitation(
      decoded_token.id,
      user_to_be_friend_id,
    );
  }

  @Put('accept/:friendship_id')
  accept(
    @DecodedToken() decoded_token: DecodedTokenType,
    @UuidParam('friendship_id') friendship_id: string,
  ) {
    return this.friendshipService.acceptFriendshipSolicitation(
      friendship_id,
      decoded_token.id,
    );
  }

  @Put('block/:friendship_id')
  block(
    @DecodedToken() decoded_token: DecodedTokenType,
    @UuidParam('friendship_id') friendship_id: string,
  ) {
    return this.friendshipService.blockFriendship(
      friendship_id,
      decoded_token.id,
    );
  }
}
