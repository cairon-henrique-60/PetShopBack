import { Repository } from 'typeorm';

import { AppDataSource } from 'src/lib/database/database.providers';

import { Friendship } from '../entities/friendship.entity';

export const friendshipRepository: Repository<Friendship> =
  AppDataSource.getRepository(Friendship);
