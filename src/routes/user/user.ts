import { Router, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import verifyAuth from '@/middlewares/verifyUser';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/user/schema';
import formUpload from '@/middlewares/form.middleware';
import { UserBookQuery } from '@/utils/interfaces/user.interface';
import CustomRequest from '@/utils/interfaces/request.interface';

class userRouter implements RouteInterface {
  public router: Router = Router();
  public upload: Multer;
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.upload = formUpload('uploads/users')
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', verifyAuth, this.getUser);
    this.router.patch('/', verifyAuth, this.upload.single("avatar"), validationMiddleware(validate.userEditSchema), this.update);
    this.router.get('/books', verifyAuth, this.getBookByShelve);
  }

  private getUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id = req.user?._id as string;
      const user = await userController.getUserDetails(id);
      res.status(200).json(user);
    } catch (error: any) {
      next(new httpException(400, error.message as string));
    }
  }

  private update = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {

    try {
      const id: string = req.user?._id as string;
      let avatar = '';
      if (req.file) {
        if (req.user?.avatar) {
          const publicId = req.user?.avatar.split("/").pop()?.split(".")[0];
          await cloudinary.uploader.destroy(publicId!);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        avatar = result.secure_url;
        req.body.avatar = avatar;
      }
      const user = await userController.editUser(id, req.body);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).json({ status: 'Updated successfully', updatedUser: user });
    } catch (error: any) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message as string));
    }
  }

  /*
    /profile/books?shelve=read&skip=0&limit=10
  */
  private getBookByShelve = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id: string = req.user!._id as string;
      const { shelve, skip, limit }: UserBookQuery = req.query;
      const user = await userController.getUserBooks(id, { shelve, skip, limit });
      res.status(200).json(user);
    } catch (error: any) {
      next(new httpException(400, error.message as string));
    }
  }
}

export default userRouter;