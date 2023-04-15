import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import RouteInterface from '@/utils/interfaces/router.interface';
import categoryController from '@/controllers/category';
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin';
import validationMiddleware from '@/middlewares/validation.middleware';
import categoryValidator from '@/utils/validations/category/schema';
import userController from '@/controllers/user';
import formUpload from '@/middlewares/form.middleware';

class categoryAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload: multer.Multer;
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.upload = formUpload('uploads/categories');
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', verifyAdmin, this.upload.none(), this.getAllCategories);
    this.router.post('/', this.upload.single("categoryCover"), validationMiddleware(categoryValidator.createCategory), this.addCategory);
    this.router.delete('/:id', verifyAdmin, this.deleteGategory);
    this.router.patch('/:id', verifyAdmin, this.upload.single("categoryCover"), this.editGategory);
    this.router.get('/:categoryName/books', verifyAdmin, this.upload.none(), this.getAllBooks);
    this.router.get('/:id', verifyAdmin, this.upload.none(), this.getCategoryById);
  }
  private getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const categories = await categoryController.getAll(req.query)
      res.status(200).json({ categories });
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }

  private addCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { name } = req.body;
    let categoryCover = '';
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        categoryCover = result.secure_url;
        fs.unlinkSync(req.file.path);
      }
      const category = await categoryController.add({ name, categoryCover });
      res.status(200).json({ status: 201, category });
    } catch (error: any) {
      if (req.file) {
        const publicId = categoryCover.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message));
    }
  }

  private deleteGategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const categoryDetail = await categoryController.getById(id);
      const category = await categoryController.remove(id);
      if (categoryDetail?.categoryCover) {
        const publicId = categoryDetail.categoryCover.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
      }
      res.status(200).json({ status: 201, category });
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }

  private editGategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    const { name } = req.body;
    let categoryCover = '';
    try {
      const categoryDetail = await categoryController.getById(id);
      if (req.file) {
        if (categoryDetail?.categoryCover) {
          const publicId = categoryDetail.categoryCover.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId!);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        categoryCover = result.secure_url;
        fs.unlinkSync(req.file.path);
        req.body.coverPhoto = categoryCover;
      }
      const category = await categoryController.edit(id, { name, categoryCover });
      res.status(200).json({ status: 201, category });
    } catch (error: any) {
      if (req.file) {
        const publicId = categoryCover.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(publicId!);
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message));
    }
  }

  private getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { grategoryName } = req.params;
    try {
      const books = await categoryController.getAllBooks(grategoryName);
      if (books.length < 1) next(new httpException(400, "no books in this category"));
      res.status(200).json({ status: 201, books });
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }

  private getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { id } = req.params;
    try {
      const category = await categoryController.getById(id);
      res.status(200).json({ status: 201, category });
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  }

}

export default categoryAdminRouter;