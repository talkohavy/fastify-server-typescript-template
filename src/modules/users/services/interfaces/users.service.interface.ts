import type { PaginationParams } from '../../../../common/types';

export type GetUsersQueryDto = {
  filter?: Record<string, unknown>;
  pagination?: PaginationParams;
};

export type CreateUserDto = {
  email: string;
  password: string;
  nickname: string;
  dateOfBirth: number | string;
};

export type UpdateUserDto = {
  email?: string;
  password?: string;
  nickname?: string;
  dateOfBirth?: number | string;
};
