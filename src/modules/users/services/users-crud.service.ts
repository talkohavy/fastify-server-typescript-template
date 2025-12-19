import type { PaginatedResult, PaginationParams } from '../../../common/types';
import type { IUsersRepository } from '../repositories/interfaces/users.repository.base';
import type { DatabaseUser } from '../types';
import type { CreateUserDto, UpdateUserDto } from './interfaces/users.service.interface';
import { UserNotFoundError } from '../logic/users.errors';
import { createNewUserPayload } from '../logic/utils/createNewUserPayload';

export type GetUsersQuery = {
  filter?: Record<string, unknown>;
  pagination?: PaginationParams;
};

export class UsersCrudService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async createUser(userData: CreateUserDto): Promise<DatabaseUser> {
    const newUserPayload = createNewUserPayload(userData);

    const createdUser = await this.usersRepository.createUser(newUserPayload);

    return createdUser;
  }

  async getUserById(userId: string): Promise<DatabaseUser> {
    const user = await this.usersRepository.getUserById(userId);

    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async getUsers(query?: GetUsersQuery): Promise<PaginatedResult<DatabaseUser>> {
    const { filter, pagination } = query || {};

    return this.usersRepository.getUsers({ filter, pagination });
  }

  async updateUserById(userId: string, userData: UpdateUserDto): Promise<DatabaseUser> {
    const updatedUser = await this.usersRepository.updateUserById(userId, userData);

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<{ success: boolean }> {
    try {
      await this.usersRepository.deleteUserById(userId);
      return { success: true };
    } catch {
      return { success: false };
    }
  }
}
