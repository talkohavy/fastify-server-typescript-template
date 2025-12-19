import type { PaginatedResult } from '../../../common/types';
import type { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import type { DatabaseUser } from '../types';
import type { CreateUserDto, GetUsersQueryDto, UpdateUserDto } from './interfaces/users.service.interface';
import { UserNotFoundError } from '../logic/users.errors';
import { createNewUserPayload } from '../logic/utils/createNewUserPayload';

export class UsersCrudService {
  constructor(private readonly usersRepositoryAdapter: IUsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<DatabaseUser> {
    const newUserPayload = createNewUserPayload(userData);

    const createdUser = await this.usersRepositoryAdapter.createUser(newUserPayload);

    return createdUser;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const user = await this.usersRepositoryAdapter.getUserById(userId);

    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async getUsers(query?: GetUsersQueryDto): Promise<PaginatedResult<DatabaseUser>> {
    return this.usersRepositoryAdapter.getUsers(query);
  }

  async updateUserById(userId: string, userData: UpdateUserDto): Promise<DatabaseUser> {
    const updatedUser = await this.usersRepositoryAdapter.updateUserById(userId, userData);

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<{ success: boolean }> {
    try {
      await this.usersRepositoryAdapter.deleteUserById(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
