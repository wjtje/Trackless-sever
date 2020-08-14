import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import groupIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/groupIdCheckHandler';
import { handleQuery } from '../../scripts/handle';
import { DBcon } from '../..';

const router = express.Router();

router.get(
  '/:groupId',
  authHandler('trackless.access.read'),
  groupIdCheckHandler(),
  (request, response, next) => {
    DBcon.query(
      "SELECT `access_id`, `access` FROM `TL_access` WHERE `group_id`=?",
      [request.params.groupId],
      handleQuery(next, (result) => {
        response.status(200).json(result);
      })
    );
  }
);

router.use(unusedRequestTypes());

export default router;
