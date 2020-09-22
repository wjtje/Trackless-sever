// Copyright (c) 2020 Wouter van der Wal

import express from 'express'
import { DBcon } from '../..'
import { handleQuery } from '../../scripts/handle'
import authHandler from '../../scripts/RequestHandler/authHandler'
import userIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/userIDCheckHandler'
import workIDuserIDCheckHandler from '../../scripts/RequestHandler/idCheckHandler/workIDuserIDCheckHandler'
import { TLWork, responseWork } from '../../scripts/responseWork'

const router = express.Router()

router.get(
  '/:userID/work/:workID',
  authHandler(request => (request.params.userID === '~') ? 'trackless.work.readOwn' : 'trackless.work.readAll'),
  userIDCheckHandler(),
  workIDuserIDCheckHandler(),
  (request, response, next) => {
    // Get the work from the server
    DBcon.query(
      'SELECT workID, `time`, `date`, description, TL_users.userID as `user.userID`, TL_users.firstname as `user.firstname`, TL_users.lastname as `user.lastname`, TL_users.username as `user.username`, TL_groups.groupID as `user.groupID`, TL_groups.groupName as `user.groupName`, TL_locations.locationID as `location.locationID`, TL_locations.place as `location.place`, TL_locations.name as `location.name`, TL_locations.id as `location.id`, TL_worktype.worktypeID as `worktype.worktypeID`, TL_worktype.name as `worktype.name` FROM `TL_work` INNER JOIN `TL_users` USING (`userID`) INNER JOIN `TL_locations` USING (`locationID`) INNER JOIN `TL_worktype` USING (`worktypeID`) INNER JOIN `TL_groups` USING (`groupID`) WHERE `userID`=? AND `workID`=?',
      [(request.params.userID === '~') ? request.user?.userID : request.params.userID, request.params.workID],
      handleQuery(next, (result:Array<TLWork>) => {
        responseWork(result, response)
      })
    )
  }
)

export default router
