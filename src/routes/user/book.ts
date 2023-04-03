import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book';
import httpException from '@/utils/exceptions/http.exception';
import verifyAuth from '@/middlewares/verifyUser';
import CustomRequest from '@/utils/interfaces/request.interface';
import Pagination from '@/utils/interfaces/pagination.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/book/schema';
class bookRouter implements RouteInterface {
  public router: Router = Router();
  public upload: multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('', this.getBooks);
    this.router.get('/:id', verifyAuth,this.getBook);
    this.router.get('/:id/reviews', verifyAuth, this.getReviews);
    this.router.patch('/:id/review', verifyAuth,this.upload.none(), validationMiddleware(validate.reviews), this.editReviews);
    this.router.patch('/:id/shelve', verifyAuth, this.upload.none(), validationMiddleware(validate.updateBook), this.changeBookShelve);
  }

  private getBooks = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { skip, limit }: Pagination = req.query
      const books = await bookController.getAllBooks({ skip, limit });
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

  private changeBookShelve = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { shelve } = req.body
      const updatedUser = await bookController.editBookShelve(req.params.id, shelve, req.user!._id!);
      res.status(200).json({ status: "Success", user: updatedUser });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
  private editReviews = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const bookId : string = req.params.id;
      req.body.userId = req.user?._id;
      req.body.username= req.user?.firstName + ' ' + req.user?.lastName;     
      const updatedReview = await bookController.updatedReview(bookId, req.body)
      res.status(200).json(updatedReview)
    } catch (error: any) {
      next(new httpException(401, error.message as string));

    }
  }
  private getReviews = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const bookId : string = req.params.id; 
      const reviews = await bookController.getReviews(bookId)
      res.status(200).json(reviews)
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
}

export default bookRouter;