import { server } from '.';

import groupRoute from './api/group';
server.use('/group', groupRoute);

import severAboutRoute from './api/server/about';
server.use('/server/about', severAboutRoute);
