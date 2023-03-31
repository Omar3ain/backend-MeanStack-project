import authorController from '@/controllers/author'
import verifyAdmin from '@/middlewares/verifyAdmin';
import httpException from '@/utils/exceptions/http.exception';
import RouteInterface from '@/utils/interfaces/router.interface';
import fs from 'fs';
import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

class AuthorAdminRouter implements RouteInterface {
    public router: Router = Router();
    public upload!: multer.Multer;

    constructor() {

        this.upload = multer({
            storage: multer.diskStorage({
                destination: (req: Request, file, cb) => {
                    cb(null, 'uploads/authors')
                },
                filename: (req: Request, file, cb) => {
                    let timeStamp = Date.now();
                    cb(null, file.originalname.split('.')[0] + "-" + timeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
                }
            }),
            fileFilter: (req: Request, file, cb) => {
                let ext = path.extname(file.originalname);
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                    return cb(new Error('Only images are allowed!'));
                }
                cb(null, true);
            }
        });
        this.initializeRoutes()
    }

    private initializeRoutes = () => {
        this.router.post('/', verifyAdmin,this.upload.single("photo"), this.createAuthor)
        this.router.patch('/:id', verifyAdmin,this.upload.single("photo"), this.editAuthor)
        this.router.delete('/:id', verifyAdmin,this.upload.single("photo"), this.deleteAuthor)
    }
    private createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

        const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
        const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
        try {
            const createdAuthor = await authorController.createAuthor(req.body, photo);
            res.status(200).json({ createdAuthor });
        } catch (err: any) {
            fs.unlinkSync(filePath);
            console.error('Error creating author:', err);
            next(new httpException(401, err.massage as string));
        }

    };

    private editAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        const photo = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
        const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
        try {
            const id = req.params.id;
            if(photo !== "") req.body.photo = photo;
            const updatedAuthor = await authorController.updateAuthor(id , req.body);
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