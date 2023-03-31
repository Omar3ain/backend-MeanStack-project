import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book';
import httpException from '@/utils/exceptions/http.exception';
import Pagination from '@/utils/interfaces/pagination.interface';

class bookRouter implements RouteInterface {
  public router: Router = Router();
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('', this.getBooks);
    this.router.get('/:id', this.getBook);
  }

  private getBooks = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {skip, limit} : Pagination = req.query
      const books = await bookController.getAllBooks({skip, limit});
      res.status(200).json(books);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
  private getBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const book = await bookController.getBookDetails(req.params.id);
      res.status(200).json(book);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default bookRouter;