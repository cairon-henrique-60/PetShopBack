/* eslint-disable @typescript-eslint/no-unused-vars */
import { DataSource } from 'typeorm';
import { hash } from 'bcrypt';

import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { User } from 'src/modules/user/entities/user.entity';

export default class UserSeeder implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);

    const userData = {
      user_name: 'admin',
      user_email: 'admin@gmail.com',
      user_type: 'ADMIN',
      hashed_password: await hash('teste', 10),
      user_auth_provider: 'EMAIL',
      phone_number: '3499999988',
      is_email_verified: false,
    };

    const newUser = userRepository.create(userData);
    await userRepository.save(newUser);
  }
}
