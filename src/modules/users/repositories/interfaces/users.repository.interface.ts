import type { QueryOptions } from 'mongoose';
import type { PaginationParams } from '../../../../common/types';
import type { DatabaseUser } from '../../types';

export type GetUserByEmailOptions = {
  fields?: any;
  /**
   * _**lean**_ option is set to `true` by default.
   */
  options?: QueryOptions;
};

export type CreateUserDto = Omit<DatabaseUser, 'id'>;

export type GetUsersProps = {
  filter?: Record<string, unknown>;
  fields?: string[];
  pagination?: PaginationParams;
};

export type GetUserByIdOptions = any;

export type UpdateUserDto = {
  name?: string;
  age?: number;
  email?: string;
};
