import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    await this.repository.save(
      this.repository.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@example.com',
        password: 'secret',
        permission: ['files', 'users'],
        role: {
          id: RoleEnum.admin,
          name: 'Admin',
        },
        status: {
          id: StatusEnum.active,
          name: 'Active',
        },
      }),
    );

    await this.repository.save(
      this.repository.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'secret',
        permission: ['files'],
        role: {
          id: RoleEnum.user,
          name: 'User',
        },
        status: {
          id: StatusEnum.active,
          name: 'Active',
        },
      }),
    );

    await this.repository.save(
      this.repository.create({
        firstName: 'John2',
        lastName: 'Doe',
        email: 'john.doe2@example.com',
        password: 'secret',
        permission: ['users'],
        role: {
          id: RoleEnum.user,
          name: 'User',
        },
        status: {
          id: StatusEnum.active,
          name: 'Active',
        },
      }),
    );
  }
}
