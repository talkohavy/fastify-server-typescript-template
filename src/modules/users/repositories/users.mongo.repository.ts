import { type ApplyBasicCreateCasting, type QueryFilter, type Mongoose, Types } from 'mongoose';
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
import { DEFAULT_PAGINATION } from '../../../common/constants';
import { calculateOffset } from '../../../common/utils/pagination/calculateOffset';
import { createPaginationMeta } from '../../../common/utils/pagination/createPaginationMeta';
import { UserModel } from '../../../database/mongo/models/user/user.model';

const { ObjectId } = Types;

export class UsersMongoRepository implements IUsersRepository {
  constructor(_mongoClient: Mongoose) {}

  async getUserByEmail(email: string, options: GetUserByEmailOptions = {}): Promise<DatabaseUser | null> {
    const { options: optionsRaw = {} } = options; // , fields

    const queryStatement: QueryFilter<any> = { email };
    const fieldProjection = undefined; // getProjection(fields);
    const queryOptions = { lean: true, ...optionsRaw };

    const userResult = (await UserModel.findOne(
      queryStatement,
      fieldProjection,
      queryOptions,
    )) as unknown as DatabaseUser;

    return userResult;
  }

  async createUser(body: CreateUserDto): Promise<DatabaseUser> {
    const userData: ApplyBasicCreateCasting<any> = { _id: new ObjectId(), ...body };

    const userResult = (await UserModel.create(userData)) as unknown as DatabaseUser;

    return userResult;
  }

  async getUsers(props?: GetUsersProps): Promise<PaginatedResult<DatabaseUser>> {
    const { filter = {}, pagination } = props || {};
    const {
      page = DEFAULT_PAGINATION.page,
      limit = DEFAULT_PAGINATION.limit,
      sortOrder = DEFAULT_PAGINATION.sortOrder,
      sortBy = '_id',
    } = pagination || {};

    const offset = calculateOffset(page, limit);

    const totalItems = await UserModel.countDocuments(filter as QueryFilter<any>);

    const sortObj: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };

    // Execute paginated query:
    const users = (await UserModel.find(filter as QueryFilter<any>)
      .sort(sortObj)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec()) as unknown as Array<DatabaseUser>;

    return {
      data: users,
      meta: createPaginationMeta(totalItems, page, limit),
    };
  }

  async getUserById(userId: string, options: GetUserByIdOptions = {}): Promise<DatabaseUser | null> {
    const { options: optionsRaw = {} } = options; // fields,
    const projection = undefined; // getProjection(fields);
    const queryOptions = { lean: true, ...optionsRaw };

    const userResult = (await UserModel.findById(userId, projection, queryOptions)) as DatabaseUser | null; // <--- This query ONLY WORKS if you had manually declared an _id field in your model. If not, you'd get back an error saying: "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"

    return userResult;
  }

  async updateUserById(userId: string, body: UpdateUserDto): Promise<DatabaseUser> {
    const queryStatement: QueryFilter<any> = { _id: userId };
    const updateStatement = [{ $addFields: body }];
    const updateOptions = { new: true, lean: true }; // As an alternative to the `new` option, you can also use the `returnOriginal` option. returnOriginal: false is equivalent to new: true. The returnOriginal option exists for consistency with the the MongoDB Node driver's findOneAndUpdate(), which has the same option.

    const updatedUser = (await UserModel.findOneAndUpdate(
      queryStatement,
      updateStatement,
      updateOptions,
    )) as unknown as DatabaseUser;

    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(userId);
    return !!result;
  }
}
