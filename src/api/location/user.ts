import express from 'express';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import moment from 'moment';
import _ from 'lodash';

const router = express.Router();

// Get last used
router.get(
  '/:userId/last',
  authHandler('trackless.location.read'),
  (request, response, next) => {
    // Get last location_id from the server
    DBcon.query(
      "SELECT `location_id`, `name`, `place`, `id` FROM `TL_work` INNER JOIN `TL_locations` USING (`location_id`) WHERE `user_id`=? ORDER BY `work_id` DESC LIMIT 1",
      [(request.params.userId === '~')? request.user?.user_id:request.params.userId],
      handleQuery(next, (result) => {
        response.status(200).json(result)
      })
    )
  }
)

// Get most used
router.get(
  '/:userId/most',
  authHandler('trackless.location.read'),
  (request, response, next) => {
    // Get two random locations
    DBcon.query(
      "SELECT r1.location_id, r1.name, r1.place, r1.id FROM `TL_locations` AS r1 JOIN (SELECT CEIL(RAND() * (SELECT MAX(location_id) FROM `TL_locations`)) AS location_id) AS r2 WHERE r1.location_id >= r2.location_id ORDER BY r1.location_id ASC LIMIT 2",
      handleQuery(next, (randomLocations) => {
        // Get most used location_id from the server (limit 2)
        DBcon.query(
          "SELECT `location_id`, `name`, `place`, `id`, COUNT(`location_id`) as `occurrence` FROM `TL_work` INNER JOIN `TL_locations` USING (`location_id`) WHERE `user_id` = ? AND `date` >= ? AND `date` <= ? GROUP BY `location_id` ORDER BY `occurrence` DESC LIMIT 2",
          [
            request.user?.user_id,
            moment().subtract(7, 'days').format("YYYY-MM-DD"),  // Last week
            moment().format("YYYY-MM-DD"),                      // Now
          ],
          handleQuery(next, (result) => {
            // Return to the user
            response.status(200).json([
              _.get(result, '[0]', randomLocations[0]),
              _.get(result, '[1]', randomLocations[1])
            ])
          })
        )
      })
    )
  }
)

router.use(unusedRequestTypes());

export default router;
