import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../../lib/lucky-server';
import type { IDragonsAdapter } from '../adapters/dragons.adapter.interface';
import { API_URLS, StatusCodes } from '../../../../common/constants';

export class DragonsController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly dragonsAdapter: IDragonsAdapter,
  ) {}

  private createDragon(app: FastifyInstance) {
    app.post(API_URLS.dragons, async (req, res) => {
      const { body } = req as any;

      app.logger.info(`POST ${API_URLS.dragons} - creating new dragon`);

      const newDragon = await this.dragonsAdapter.createDragon(body);

      res.status(StatusCodes.CREATED);
      return newDragon;
    });
  }

  private getDragons(app: FastifyInstance) {
    app.get(API_URLS.dragons, async (_req, _res) => {
      app.logger.info(`GET ${API_URLS.dragons} - fetching dragons`);

      const dragons = await this.dragonsAdapter.getDragons();

      return dragons;
    });
  }

  private getDragonById(app: FastifyInstance) {
    app.get(API_URLS.dragonById, async (req, res) => {
      const { params } = req as any;

      app.logger.info(`GET ${API_URLS.dragonById} - fetching dragon by ID`);

      const dragonId = params.dragonId;

      const dragon = await this.dragonsAdapter.getDragonById(dragonId);

      if (!dragon) {
        app.logger.error('Dragon not found', dragonId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return dragon;
    });
  }

  private updateDragon(app: FastifyInstance) {
    app.patch(API_URLS.dragonById, async (req, res) => {
      const { params, body } = req as any;

      app.logger.info(`PUT ${API_URLS.dragonById} - updating dragon by ID`);

      const dragonId = params.dragonId!;
      const updatedDragon = await this.dragonsAdapter.updateDragon(dragonId, body);

      if (!updatedDragon) {
        app.logger.error('Dragon not found', dragonId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return updatedDragon;
    });
  }

  private deleteDragon(app: FastifyInstance) {
    app.delete(API_URLS.dragonById, async (req, res) => {
      const { params } = req as any;

      app.logger.info(`DELETE ${API_URLS.dragonById} - deleting dragon by ID`);

      const dragonId = params.dragonId!;
      const deletedDragon = await this.dragonsAdapter.deleteDragon(dragonId);

      if (!deletedDragon) {
        app.logger.error('Dragon not found', dragonId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return { message: 'Dragon deleted successfully' };
    });
  }

  registerRoutes() {
    this.app.register(this.createDragon.bind(this));
    this.app.register(this.getDragons.bind(this));
    this.app.register(this.getDragonById.bind(this));
    this.app.register(this.updateDragon.bind(this));
    this.app.register(this.deleteDragon.bind(this));
  }
}
