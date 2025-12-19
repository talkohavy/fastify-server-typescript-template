import type { FastifyInstance, RouteShorthandOptions } from 'fastify';
import type { ControllerFactory } from '../../../lib/lucky-server';
import type { BooksService } from '../services/books.service';
import { API_URLS, StatusCodes } from '../../../common/constants';
import { createBookSchema } from './dto/createBook.dto';
import { updateBookSchema } from './dto/updatedBook.dto';

export class BooksController implements ControllerFactory {
  constructor(
    private readonly app: FastifyInstance,
    private readonly booksService: BooksService,
  ) {}

  private createBook(app: FastifyInstance) {
    const createBookOptions: RouteShorthandOptions = {
      schema: {
        body: createBookSchema,
      },
    };

    app.post(API_URLS.books, createBookOptions, async (req, res) => {
      const { body } = req as any;

      app.logger.info(`POST ${API_URLS.books} - creating new book`);

      const newBook = await this.booksService.createBook(body);

      res.status(StatusCodes.CREATED);
      return newBook;
    });
  }

  private getBooks(app: FastifyInstance) {
    app.get(API_URLS.books, async (_req, _res) => {
      app.logger.info(`GET ${API_URLS.books} - fetching books`);

      const books = await this.booksService.getBooks();

      return books;
    });
  }

  private getBookById(app: FastifyInstance) {
    app.get(API_URLS.bookById, async (req, res) => {
      const { params } = req as any;

      app.logger.info(`GET ${API_URLS.bookById} - fetching book by ID`);

      const bookId = params.bookId;

      const book = await this.booksService.getBookById(bookId);

      if (!book) {
        app.logger.error('Book not found', bookId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Book not found' };
      }

      return book;
    });
  }

  private updateBook(app: FastifyInstance) {
    const updateBookOptions: RouteShorthandOptions = {
      schema: {
        body: updateBookSchema,
      },
    };

    app.patch(API_URLS.bookById, updateBookOptions, async (req, res) => {
      const { body, params } = req as any;

      app.logger.info(`PATCH ${API_URLS.bookById} - updating book by ID`);

      const bookId = params.bookId!;
      const updatedBook = await this.booksService.updateBook(bookId, body);

      if (!updatedBook) {
        app.logger.error('Book not found', bookId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Book not found' };
      }

      return updatedBook;
    });
  }

  private deleteBook(app: FastifyInstance) {
    app.delete(API_URLS.bookById, async (req, res) => {
      const { params } = req as any;

      app.logger.info(`DELETE ${API_URLS.bookById} - deleting book by ID`);

      const bookId = params.bookId!;
      const deletedBook = await this.booksService.deleteBook(bookId);

      if (!deletedBook) {
        app.logger.error('Book not found', bookId);

        res.status(StatusCodes.NOT_FOUND);
        return { message: 'Book not found' };
      }

      return { message: 'Book deleted successfully' };
    });
  }

  registerRoutes() {
    this.app.register(this.getBooks.bind(this));
    this.app.register(this.getBookById.bind(this));
    this.app.register(this.createBook.bind(this));
    this.app.register(this.updateBook.bind(this));
    this.app.register(this.deleteBook.bind(this));
  }
}
