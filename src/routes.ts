import { server } from '.';

import apiRoute from './api/api';
server.use('/api', apiRoute);

import groupRoute from './api/group';
server.use('/group', groupRoute);

import userRoute from './api/user';
server.use('/user', userRoute);

import severAboutRoute from './api/server/about';
server.use('/server/about', severAboutRoute);
