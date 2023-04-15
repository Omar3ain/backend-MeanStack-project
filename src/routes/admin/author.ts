import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

import authorController from '@/controllers/author'
import verifyAdmin from '@/middlewares/verifyAdmin';
import httpException from '@/utils/exceptions/http.exception';
import RouteInterface from '@/utils/interfaces/router.interface';
import formUpload from '@/middlewares/form.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/author/Schema'


class AuthorAdminRouter implements RouteInterface {
    public router: Router = Router();
    public upload!: Multer;

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        this.upload = formUpload('uploads/authors');
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post('/', verifyAdmin, this.upload.single("photo"), validationMiddleware(validate.createAuthorSchema), this.createAuthor)
        this.router.patch('/:id', verifyAdmin, this.upload.single("photo"), validationMiddleware(validate.editAuthorSchema), this.editAuthor)
        this.router.delete('/:id', verifyAdmin, this.upload.single("photo"), this.deleteAuthor)
    }
    private createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        let photo = '';
        try {
            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                photo = result.secure_url;
                fs.unlinkSync(req.file.path);
            }
            const createdAuthor = await authorController.createAuthor(photo, req.body);
            res.status(200).json({ createdAuthor });
        } catch (err: any) {
            if (req.file) {
                const publicId = photo.split("/").pop()?.split(".")[0];
                await cloudinary.uploader.destroy(publicId!);
                fs.unlinkSync(req.file.path);
            }
            next(new httpException(400, err.massage as string));
        }
    };

    private editAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        let photo = '';
        try {
            const id = req.params.id;
            const author = await authorController.getAuthorById(id);
            if (req.file) {
                if (author.photo) {
                    const publicId = author.photo.split("/").pop()?.split(".")[0];
                    await cloudinary.uploader.destroy(publicId!);
                }
                const result = await cloudinary.uploader.upload(req.file.path);
                photo = result.secure_url;
                fs.unlinkSync(req.file.path);
                req.body.photo = photo;
            }
            const updatedAuthor = await authorController.updateAuthor(id, req.body);
            res.status(200).json(updatedAuthor);
        } catch (err: any) {
            if (req.file) {
                const publicId = photo.split("/").pop()?.split(".")[0];
                await cloudinary.uploader.destroy(publicId!);
                fs.unlinkSync(req.file.path);
            }
            next(new httpException(400, "Cant edit the Author please try again."));
        }

    };

    private deleteAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = req.params.id;
        try {
            const author = await authorController.getAuthorById(id);
            if (author.photo) {
                const publicId = author.photo.split("/").pop()?.split(".")[0];
                await cloudinary.uploader.destroy(publicId!);
            }
            const deleteAuthor = await authorController.deleteAuthorById(id);
            res.status(200).json(deleteAuthor)
        }
        catch (err: any) {
            next(new httpException(400, err.massage as string));
        }
    }
}

export default AuthorAdminRouter;