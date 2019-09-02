import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscriptionsController from './app/controllers/SubscriptionsController';
import ListAllMeetups from './app/controllers/ListAllMeetups';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.put('/users', authMiddleware, UserController.update);
routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetapps', MeetupController.store);
routes.put('/meetapps/:meetappId', MeetupController.update);
routes.get('/meetapps', MeetupController.index);
routes.delete('/meetapps/:meetappId', MeetupController.delete);

routes.post('/subscriptions/:meetappId', SubscriptionsController.store);
routes.get('/subscriptions', SubscriptionsController.index);

routes.get('/list', ListAllMeetups.index);

export default routes;
