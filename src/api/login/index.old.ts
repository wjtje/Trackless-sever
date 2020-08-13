server.post('/login', (request, response) => {
  requiredDataCheck(request, response, [
    {name: 'username', check: mysqlTEXT},
    {name: 'password', check: mysqlTEXT},
    {name: 'deviceName', check: mysqlTEXT},
  ]).then(() => {
    // Get the infomation needed from the server
    DBcon.query(
      "SELECT `salt_hash`, `hash`, `user_id` FROM `TL_users` WHERE `username`=?",
      [request.body.username],
      handleQuery(response, (result) => {
        // Check the password
        if (sha512_256(request.body.password + _get(result, '[0].salt_hash', '')) === _get(result, '[0].hash', '')) {
          const apiKey:string = sha512_256(Date.now().toString()); // Generated using time
          const user_id:number = result[0].user_id;

          // Send it to the database
          DBcon.query(
            "INSERT INTO `TL_apikeys` ( `apiKey`, `deviceName`, `user_id` ) VALUES (?,?,?)",
            [
              sha512_256(apiKey),
              request.body.deviceName,
              user_id
            ],
            handleQuery(response, () => {
              responseCreated(response, {
                bearer: apiKey
              })
            })
          );
        } else {
          responseBadRequest(response, {
            error: {
              message: checkUsernamePasswd
            }
          });
        }
      })
    )
  }).catch(([missing, typeErr]) => {
    // Something is missing report to the user
    missingError(response, missing, typeErr);
  });
});
