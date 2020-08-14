import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import userIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIdCheckHandler';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { handleQuery } from '../../scripts/handle';
import { responseWork, TLWork } from './script';
import { DBcon } from '../..';
import workIdCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIdCheckHandler';
import { patchHandler, handlePatchQuery } from '../../scripts/RequestHandler/patchHandler';
import { mysqlINT, mysqlTEXT, mysqlDATE } from '../../scripts/types';
import ServerError from '../../scripts/RequestHandler/serverErrorInterface';

const router = express.Router();

// Get all the work for a user
router.get(
  '/:userId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn';
    } else {
      return 'trackless.work.readAll';
    }
  }),
  userIdCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? ORDER BY `date`",
      [(request.params.userId == '~')? request.user?.user_id:request.params.userId],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response);
      })
    );
  }
)

// Get all the work for a user in a time span
router.get(
  '/:userId/date/:start/:end',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn';
    } else {
      return 'trackless.work.readAll';
    }
  }),
  userIdCheckHandler(),
  (request, response, next) => {
    // Get all the work for that user
    DBcon.query(
      "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? AND `date` >= ? AND `date` <= ? ORDER BY `date`",
      [
        (request.params.userId == '~')? request.user?.user_id:request.params.userId,
        request.params.start,
        request.params.end
      ],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response);
      })
    );
  }
)

// Get a single work object from a user
router.get(
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.readOwn';
    } else {
      return 'trackless.work.readAll';
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server and return it
    DBcon.query(
      "SELECT `work_id`, `user_id`, `location_id`, `group_id`, `time`, `date`, `description`, `name`, `place`, `id`, `firstname`, `lastname`, `username`, `groupName` FROM `TL_work` INNER JOIN `TL_users` USING (`user_id`) INNER JOIN `TL_locations` USING (`location_id`) INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=? AND `work_id`=?",
      [
        (request.params.userId == '~')? request.user?.user_id:request.params.userId,
        request.params.workId
      ],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response);
      })
    );
  }
)

// Remove a single work object from a user
router.delete(
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.removeOwn';
    } else {
      return 'trackless.work.removeAll';
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  (request, response, next) => {
    // Get the data from the server and return it
    DBcon.query(
      "DELETE FROM `TL_work` WHERE `user_id`=? AND `work_id`=?",
      [
        (request.params.userId == '~')? request.user?.user_id:request.params.userId,
        request.params.workId
      ],
      handleQuery(next, () => {
        response.status(200).json({
          message: 'done'
        })
      })
    );
  }
)

// Edit a single work object from a user
router.patch(
  '/:userId/:workId',
  authHandler((request) => {
    if (request.params.userId === '~') {
      return 'trackless.work.editOwn';
    } else {
      return 'trackless.work.editAll';
    }
  }),
  userIdCheckHandler(),
  workIdCheckHandler(),
  patchHandler([
    {name: 'location_id', check: mysqlINT},
    {name: 'date', check: mysqlDATE},
    {name: 'time', check: mysqlINT},
    {name: 'description', check: mysqlTEXT},
  ], (resolve, reject, key, request) => {
    function changeWork() {
      DBcon.query(
        "UPDATE `TL_work` SET `" + key + "`=? WHERE `work_id`=? AND `user_id`=?",
        [
          request.body[key],
          request.params.workId,
          (request.params.userId == '~') ? request.user?.user_id : request.params.userId,
        ],
        handlePatchQuery(reject, resolve)
      );
    }

    if (key === "location_id") {
      // Check if the location is valid
      DBcon.query(
        "SELECT `location_id` FROM `TL_locations` WHERE `location_id`=?",
        [request.body.location_id],
        (error, result) => {
          if (error || result.length === 0) {
            // Something wrong in the array
            const error: ServerError = new Error('Your location id is not valid');
            error.status = 400;
            error.code = 'trackless.work.patch.locationNotValid'
            reject(error);
          } else {
            changeWork();
          }
        })
    } else {
      // Change it
      changeWork()
    }
  })
)

router.use(unusedRequestTypes);

export default router;
