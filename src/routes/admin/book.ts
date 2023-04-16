import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book';
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/book/schema';
import formUpload from '@/middlewares/form.middleware';
class bookAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload: Multer;
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.upload = formUpload('uploads/books');
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get('/:id', verifyAdmin, this.getBook);
    this.router.get('/get/books', verifyAdmin, this.getBooksAdmin);
    this.router.post('/', verifyAdmin, this.upload.single("coverPhoto"), validationMiddleware(validate.createBook), this.makeBook);
    this.router.delete('/:id', verifyAdmin, this.deleteBook);
    this.router.patch(`/:id`, verifyAdmin, this.upload.single("coverPhoto"), validationMiddleware(validate.updateBook), this.update);
  }
  private makeBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    let coverPhoto = '';
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        coverPhoto = result.secure_url;
      }
      const book = await bookController.createBook(req.body, coverPhoto);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).json({ book });
    } catch (error: any) {
      if (req.file) {
        const publicId = coverPhoto.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message));
    }
  }
  private getBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const book = await bookController.getBookDetails(req.params.id);
      res.status(200).json(book);
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }

  private deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id: string = req.params.id;
      const book = await bookController.getBookDetails(id);
      await bookController.deleteBook(id);
      if (book?.coverPhoto) {
        const publicId = book.coverPhoto.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
      }
      res.status(200).json({ status: 'Deleted successfully' });
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }
  private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    let coverPhoto = '';
    try {
      const id: string = req.params.id;
      const bookdetail = await bookController.getBookDetails(id);
      if (req.file) {
        if (bookdetail?.coverPhoto) {
          const publicId = bookdetail.coverPhoto.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId!);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        coverPhoto = result.secure_url;
        req.body.coverPhoto = coverPhoto;
      }
      const book = await bookController.editBook(id, req.body);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).json({ status: 'Updated successfully', updatedBook: book });
    } catch (error: any) {
      if (req.file) {
        const publicId = coverPhoto.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message));
    }
  }

  private getBooksAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const books = await bookController.getAllBooksForAdmin();
      res.status(200).json(books);
    } catch (error: any) {
      next(new httpException(400, error.message));
    }

  }

}

export default bookAdminRouter;