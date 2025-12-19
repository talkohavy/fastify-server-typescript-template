import type { Client } from 'pg';
import type { PaginatedResult } from '../../../common/types';
import type { DatabaseUser } from '../types';
import type { IUsersRepository } from './interfaces/users.repository.base';
import type {
  GetUserByIdOptions,
  GetUsersProps,
  CreateUserDto,
  UpdateUserDto,
  GetUserByEmailOptions,
} from './interfaces/users.repository.interface';
import { createPaginationMeta } from '../../../common/utils/pagination/createPaginationMeta';
import { parsePaginationParams } from '../../../common/utils/pagination/parsePaginationParams';
import { buildWhereClause } from '../../../database/postgres/buildWhereClause';

const ALLOWED_SORT_COLUMNS = new Set(['id', 'email', 'nickname', 'created_at', 'updated_at', 'date_of_birth']);
const ALLOWED_FILTER_COLUMNS = new Set(['id', 'email', 'nickname', 'is_active']);

export class UsersPostgresRepository implements IUsersRepository {
  constructor(private readonly pgClient: Client) {}

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const fields = options.fields || ['*'];
    const query = `SELECT ${fields.join(', ')} FROM users WHERE email = $1`;
    const result = await this.pgClient.query(query, [email]);

    if (result.rows.length === 0) {
      result.rows.push({
        id: -1,
        nickname: 'dummy',
        email: 'dummy@gmail.com',
        hashed_password:
          'salt:94177b3f3685418853031cda2a9845bc5f7098b0a92b0acdd637694541160da8e2b2607f3331f30bff62746785a63549c05ddf09bf15384077a5f0129bbab2d0',
      } as DatabaseUser);
    }

    return result.rows[0] || null;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const query = `
      INSERT INTO users (email, hashed_password, nickname, date_of_birth, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    const values = [body.email, body.hashed_password, body.nickname, body.date_of_birth];

    const result = await this.pgClient.query(query, values);
    return result.rows[0] as DatabaseUser;
  }

  async getUsers(props?: GetUsersProps): Promise<PaginatedResult<DatabaseUser>> {
    const { filter, pagination } = props || {};

    const { page, limit, offset, sortBy, sortOrder } = parsePaginationParams(pagination, {
      allowedSortFields: ALLOWED_SORT_COLUMNS,
      defaultSortField: 'id',
    });

    const { whereClause, values } = buildWhereClause(filter, ALLOWED_FILTER_COLUMNS);

    const totalItems = await this.countUsers(whereClause, values);
    const users = await this._fetchUsers(whereClause, values, { sortBy, sortOrder, limit, offset });

    return {
      data: users,
      meta: createPaginationMeta(totalItems, page, limit),
    };
  }

  private async countUsers(whereClause: string, values: unknown[]): Promise<number> {
    const query = `SELECT COUNT(*) FROM users ${whereClause}`;
    const result = await this.pgClient.query(query, values);
    return Number.parseInt(result.rows[0].count, 10);
  }

  private async _fetchUsers(
    whereClause: string,
    values: unknown[],
    options: { sortBy: string; sortOrder: 'asc' | 'desc'; limit: number; offset: number },
  ): Promise<DatabaseUser[]> {
    const { sortBy, sortOrder, limit, offset } = options;
    const orderDirection = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const query = `
      SELECT * FROM users 
      ${whereClause}
      ORDER BY ${sortBy} ${orderDirection}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const result = await this.pgClient.query(query, values);
    return result.rows as DatabaseUser[];
  }

  async getUserById(userId: string, _options: GetUserByIdOptions = {}): Promise<DatabaseUser | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pgClient.query(query, [userId]);

    return result.rows[0] || null;
  }

  async updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser> {
    const fields = Object.keys(body).filter(
      (key) => body[key as keyof UpdateUserDto] !== undefined && key !== 'updated_at',
    );
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = [userId, ...fields.map((field) => body[field as keyof UpdateUserDto])];

    const query = `
      UPDATE users 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.pgClient.query(query, values);
    return result.rows[0] as DatabaseUser;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await this.pgClient.query(query, [userId]);

    return (result.rowCount ?? 0) > 0;
  }
}
