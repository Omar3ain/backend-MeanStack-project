import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
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

        this.upload = formUpload('uploads/authors');
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post('/', verifyAdmin, this.upload.single("photo"), validationMiddleware(validate.createAuthorSchema), this.createAuthor)
        this.router.patch('/:id', verifyAdmin, this.upload.single("photo"), validationMiddleware(validate.editAuthorSchema), this.editAuthor)
        this.router.delete('/:id', verifyAdmin, this.upload.single("photo"), this.deleteAuthor)
    }
    private createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

        const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
        const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
        try {
            const createdAuthor = await authorController.createAuthor(req.body, photo);
            res.status(200).json({ createdAuthor });
        } catch (err: any) {
            fs.unlinkSync(filePath);
            next(new httpException(401, err.massage as string));
        }

    };

    private editAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
        const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
        try {
            const id = req.params.id;
            if (photo !== "") req.body.photo = photo;
            const updatedAuthor = await authorController.updateAuthor(id, req.body);
            res.status(200).json(updatedAuthor);
        } catch (err: any) {
            fs.unlinkSync(filePath);
            next(new httpException(401, "Cant edit the Author please try again."));
        }

    };

    private deleteAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const id = req.params.id;
        try {
            const deleteAuthor = await authorController.deleteAuthorById(id);
            res.status(200).json(deleteAuthor)
        }
        catch (err: any) {
            next(new httpException(401, err.massage as string));
        }
    }
}

export default AuthorAdminRouter;