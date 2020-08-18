// Copyright (c) 2020 Wouter van der Wal

import express from 'express';
import authHandler from '../../scripts/RequestHandler/authHandler';
import { DBcon } from '../..';
import { handleQuery } from '../../scripts/handle';
import { TL_groups } from './interface';
import { promisify } from 'util';
import requireHandler from '../../scripts/RequestHandler/requireHandler';
import { mysqlTEXT } from '../../scripts/types';
import unusedRequestTypes from '../../scripts/RequestHandler/unusedRequestType';
import { getUsers } from '../query';

const query = promisify(DBcon.query).bind(DBcon);
const router = express.Router();

// Return all the groups
router.get(
  '/',
  authHandler('trackless.group.readAll'),
  (request, response, next) => {
    // List all group
    DBcon.query(
      "SELECT * FROM `TL_groups` ORDER BY `groupname`",
      handleQuery(next, (result: Array<TL_groups>) => {
        let rslt:{
          groupId: number;
          groupName: string;
          users: object;
        }[] = []; // Result

        // Get all users for each group
        Promise.all(result.map((group) => {
          return new Promise((resolve, reject) => {
            DBcon.query(
              getUsers,
              [group.groupId],
              handleQuery(next, (result) => {
                // Push the result to the response array
                rslt.push({
                  groupId: group.groupId,
                  groupName: group.groupName,
                  users: result
                });

                resolve()
              })
            )
          })
        })).then(() => {
          // Done return to the user
          response.status(200).json(rslt);
        });
      })
    );
  }
);

// Create a new group
router.post(
  '/',
  authHandler('trackless.group.create'),
  requireHandler([
    { name: 'groupName', check: mysqlTEXT },
  ]),
  (request, response, next) => {
    // Create a query
    DBcon.query(
      "INSERT INTO `TL_groups` (`groupName`) VALUES (?)",
      [request.body.groupName],
      handleQuery(next, (result) => {
        // Saved into the database
        response.status(201).json({
          groupId: result.insertId
        })
      })
    )
  }
);

// Import groupId routes
import groupIdRoute from './groupId';
router.use('/', groupIdRoute);

router.use(unusedRequestTypes());

export default router;
