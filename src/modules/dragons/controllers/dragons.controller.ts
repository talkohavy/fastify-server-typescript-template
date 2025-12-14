import type { FastifyInstance } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { DragonsService } from '../services/dragons.service';
import type { UpdateDragonDto } from '../services/interfaces/dragons.service.interface';
import { API_URLS, StatusCodes } from '../../../common/constants';

export class DragonsController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly dragonService: DragonsService,
  ) {}

  private getDragons(app: FastifyInstance) {
    app.get(API_URLS.dragons, async (_req, _res) => {
      app.log.info(`GET ${API_URLS.dragons} - fetching dragons`);

      const dragons = await this.dragonService.getDragons();

      return dragons;
    });
  }

  private getDragonById(app: FastifyInstance) {
    app.get(API_URLS.dragonById, async (req, res) => {
      const { params } = req as any;

      app.log.info(`GET ${API_URLS.dragonById} - fetching dragon by ID`);

      const dragonId = params.dragonId as string;

      const dragon = await this.dragonService.getDragonById(dragonId);

      if (!dragon) {
        app.log.error(`Dragon not found - id: ${dragonId}`);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return dragon;
    });
  }

  private createDragon(app: FastifyInstance) {
    app.post(
      API_URLS.dragons,
      // joiBodyMiddleware(createDragonSchema),
      async (req, res) => {
        const { body } = req as any;

        app.log.info(`POST ${API_URLS.dragons} - creating new dragon`);

        const newDragon = await this.dragonService.createDragon(body);

        res.status(StatusCodes.CREATED);
        return newDragon;
      },
    );
  }

  private updateDragon(app: FastifyInstance) {
    app.patch(API_URLS.dragonById, async (req, res) => {
      const { params, body } = req as any;

      app.log.info(`PUT ${API_URLS.dragonById} - updating dragon by ID`);

      const dragonId = params.dragonId as string;
      const dragon = body as UpdateDragonDto;

      const updatedDragon = await this.dragonService.updateDragon(dragonId, dragon);

      if (!updatedDragon) {
        app.log.error(`Dragon not found - id: ${dragonId}`);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return updatedDragon;
    });
  }

  private deleteDragon(app: FastifyInstance) {
    app.delete(API_URLS.dragonById, async (req, res) => {
      const { params } = req as any;

      app.log.info(`DELETE ${API_URLS.dragonById} - deleting dragon by ID`);

      const dragonId = params.dragonId as string;

      const deletedDragon = await this.dragonService.deleteDragon(dragonId);

      if (!deletedDragon) {
        app.log.error(`Dragon not found - id: ${dragonId}`);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Dragon not found' };
      }

      return { message: 'Dragon deleted successfully' };
    });
  }

  registerRoutes() {
    this.app.register(this.getDragons.bind(this));
    this.app.register(this.getDragonById.bind(this));
    this.app.register(this.createDragon.bind(this));
    this.app.register(this.updateDragon.bind(this));
    this.app.register(this.deleteDragon.bind(this));
  }
}
