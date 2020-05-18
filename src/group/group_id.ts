import { server, DBcon } from "..";
import { apiCheck, handleQuery, responseDone, reqDataCheck } from "../scripts";
import _ = require("lodash");

function wrongType(res, req) {
  res.send(JSON.stringify({
    status: 400,
    message: 'Please check the documentation. group_id needs to be a number and not a ' + typeof req.params.group_id + '.'
  }));
  res.status(400);
}

// List a group
server.get('/group/:group_id', (req, res) => {
  apiCheck(req, res, () => {
    // Check if the data is correct
    if (typeof Number(req.params.group_id) === "number") {
      // Get all the basic information from the group
      DBcon.query(
        "SELECT * FROM `TL_groups` WHERE `group_id`=?",
        [req.params.group_id],
        handleQuery(res, `Could not list the group. Does it exsist?`, (resultGroup) => {
          // Get all users
          DBcon.query(
            "SELECT `user_id`, `firstname`, `lastname`, `username` FROM `TL_users` WHERE `group_id`=?",
            [req.params.group_id],
            handleQuery(res, `Could not find any users.`, (result) => {
              // Send it back
              res.send(JSON.stringify({
                status: 200,
                message: 'done',
                result: {
                  group_id: Number(req.params.group_id),
                  groupName: _.get(resultGroup, '[0].groupName', 'undefined'),
                  users: result
                }
              }));

              res.status(200)
            })
          );
        })
      );
    } else {
      wrongType(res, req);
    }
  });
});

// Delete a group
server.delete('/group/:group_id', (req, res) => {
  apiCheck(req, res, () => {
    // Check if the data is correct
    if (typeof Number(req.params.group_id) === "number" && Number(req.params.group_id) !== 0) {
      // Get all the basic information from the group
      DBcon.query(
        "DELETE FROM `TL_groups` WHERE `group_id`=?",
        [req.params.group_id],
        handleQuery(res, `Could not list the group. Does it exsist?`, () => {
          DBcon.query(
            "UPDATE `TL_users` SET `group_id`=0 WHERE `group_id`=?",
            [req.params.group_id]
          );

          responseDone(res);
        })
      );
    } else {
      wrongType(res, req);
    }
  });
});

// Edit a group
server.patch('/group/:group_id', (req, res) => {
  reqDataCheck(req, res, [
    {name: "apiKey", type: "string"},
    {name: "groupName", type: "string"}
  ], () => {
    apiCheck(req, res, () => {
      // Check if the data is correct
      if (typeof Number(req.params.group_id) === "number") {
        // Get all the basic information from the group
        DBcon.query(
          "UPDATE `TL_groups` SET `groupName`=? WHERE `group_id`=?",
          [
            req.body.groupName,
            req.params.group_id
          ],
          handleQuery(res, `Could not save the change`, () => {
            responseDone(res);
          })
        );
      } else {
        wrongType(res, req);
      }
    });
  })
});
