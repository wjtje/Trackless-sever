import { server } from '.';

import accessRoute from './api/access';
server.use('/access', accessRoute);

import apiRoute from './api/api';
server.use('/api', apiRoute);

import groupRoute from './api/group';
server.use('/group', groupRoute);

import loginRoute from './api/login';
server.use('/login', loginRoute);

import userRoute from './api/user';
server.use('/user', userRoute);

import severAboutRoute from './api/server/about';
server.use('/server/about', severAboutRoute);
