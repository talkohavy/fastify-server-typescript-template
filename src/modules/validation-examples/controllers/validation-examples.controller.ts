import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import { API_URLS } from '../../../common/constants';

const logger = {
  info: (message: string) => {
    console.log(message);
  },
};

export class ValidationExamplesController implements ControllerFactory {
  constructor(private readonly app: FastifyInstance) {}

  private validateBodyByJson() {
    const bodyJsonSchema = {
      type: 'object',
      required: ['requiredKey'],
      properties: {
        someKey: { type: 'string' },
        someOtherKey: { type: 'number' },
        requiredKey: {
          type: 'array',
          maxItems: 3,
          items: { type: 'integer' },
        },
        nullableKey: { type: ['number', 'null'] }, // or { type: 'number', nullable: true }
        multipleTypesKey: { type: ['boolean', 'number'] },
        multipleRestrictedTypesKey: {
          oneOf: [
            { type: 'string', maxLength: 5 },
            { type: 'number', minimum: 10 },
          ],
        },
        enumKey: {
          type: 'string',
          enum: ['John', 'Foo'],
        },
        notTypeKey: {
          not: { type: 'array' },
        },
      },
    };

    const schema = {
      body: bodyJsonSchema,
    };

    this.app.post(API_URLS.validateBodyByJson, { schema }, async (req, _res) => {
      const { body } = req;

      logger.info('POST /api/validation/validate-body-by-json - validating body by json');

      return body;
    });
  }

  private validateQueryParamsByJson() {
    const queryStringJsonSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        excitement: { type: 'integer' },
      },
    };

    const schema = {
      querystring: queryStringJsonSchema,
    };

    this.app.get(API_URLS.validateQueryParamsByJson, { schema }, async (req, _res) => {
      const { query } = req;

      logger.info('GET /api/validation/validate-query-params-by-json - validating query params by json');

      return query;
    });
  }

  private validateParamsByJson() {
    const paramsJsonSchema = {
      type: 'object',
      properties: {
        part1: { type: 'string' },
        part2: { type: 'number' },
      },
    };

    const schema = {
      params: paramsJsonSchema,
    };

    this.app.get(`${API_URLS.validateParamsByJson}/:part1/:part2`, { schema }, async (req, _res) => {
      const { params } = req;

      logger.info('GET /api/validation/validate-params-by-json - validating params by json');

      return params;
    });
  }

  private validateHeadersByJson() {
    const headersJsonSchema = {
      type: 'object',
      properties: {
        'x-foo': { type: 'string' },
      },
      required: ['x-foo'],
    };

    const schema = {
      headers: headersJsonSchema,
    };

    this.app.post(API_URLS.validateHeadersByJson, { schema }, async (req, _res) => {
      const { headers } = req;

      logger.info('POST /api/validation/validate-headers-by-json - validating headers by json');

      return headers;
    });
  }

  private validatePreAddedSchema() {
    this.app.addSchema({
      $id: 'pre-added-schema',
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string' },
      },
    });

    this.app.post(
      API_URLS.validatePreAddedSchema,
      { schema: { body: { $ref: 'pre-added-schema#' } } },
      async (req, _res) => {
        const { body } = req;

        logger.info('POST /api/validation/validate-pre-added-schema - validating pre added schema');

        return body;
      },
    );
  }

  /**
   * DOESN'T WORK AS DOCUMENTATION SAYS!!!
   */
  private handleValidationErrorInsideRoute() {
    const opts: RouteShorthandOptions = {
      attachValidation: true, // <--- This is the important part!
      schema: {
        body: {
          type: 'object',
          properties: {
            bookId: { type: 'number' },
          },
        },
      },
    };

    this.app.post(API_URLS.handleValidationErrorInsideRoute, opts, async (req, res) => {
      logger.info(`POST ${API_URLS.handleValidationErrorInsideRoute} - handling validation error inside route`);

      if (req.validationError) {
        // `req.validationError.validation` contains the raw validation error
        // IMPORTANT: Return early to prevent further execution
        return res.code(407).send(req.validationError);
      }

      const { body } = req;
      return body;
    });
  }

  registerRoutes() {
    this.validateBodyByJson();
    this.validateQueryParamsByJson();
    this.validateParamsByJson();
    this.validateHeadersByJson();
    this.validatePreAddedSchema();
    this.handleValidationErrorInsideRoute();
  }
}
