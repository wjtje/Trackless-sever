import { server } from '.';

import groupRoute from './api/group';
server.use('/group', groupRoute);