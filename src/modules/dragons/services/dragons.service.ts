import type { Dragon } from '../types';
import type { CreateDragonDto, UpdateDragonDto } from './interfaces/dragons.service.interface';

const database: Array<Dragon> = [];

export class DragonsService {
  constructor() {}

  async getDragons(): Promise<Array<Dragon>> {
    return database;
  }

  async getDragonById(userId: string): Promise<Dragon | null> {
    const dragon = database.find((dragon) => dragon.id === Number.parseInt(userId, 10));

    if (!dragon) return null;

    return dragon;
  }

  async createDragon(dragon: CreateDragonDto): Promise<Dragon> {
    const newDragon = {
      id: database.length + 1,
      name: dragon.name,
      author: dragon.author,
      publishedYear: dragon.publishedYear,
    };

    database.push(newDragon);

    return newDragon;
  }

  async updateDragon(userId: string, user: UpdateDragonDto): Promise<Dragon | null> {
    const parsedId = Number.parseInt(userId, 10);
    const dragonIndex = database.findIndex((dragon) => dragon.id === parsedId);

    if (dragonIndex === -1) return null;

    database[dragonIndex] = { ...database[dragonIndex], ...user } as Dragon;

    return database[dragonIndex];
  }

  async deleteDragon(userId: string) {
    const parsedId = Number.parseInt(userId, 10);
    const dragonIndex = database.findIndex((dragon) => dragon.id === parsedId);

    if (dragonIndex === -1) return null;

    database.splice(dragonIndex, 1);

    return { message: 'Dragon deleted successfully' };
  }
}
