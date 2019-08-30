import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetappController from './app/controllers/MeetappController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetapps', MeetappController.store);
routes.put('/meetapps/:meetappId', MeetappController.update);
routes.get('/meetapps', MeetappController.index);
routes.delete('/meetapps/:meetappId', MeetappController.delete);

export default routes;
