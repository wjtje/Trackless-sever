# API commands

All the 'known' commands.

 - POST `/user`
 - GET `/user`
 - GET `/user/:user_id`
 - DELETE `/user/:user_id`
 - PATCH `/user/:user_id`
 - POST `/api`
 - GET `/api`
 - GET `/api/:api_id`
 - DELETE `/api/:api_id`
 - GET `/group`
 - POST `/group`
 - GET `/group/:group_id`
 - DELETE `/group/:group_id`
 - PATCH `/group/:group_id`
 - POST `/group/:group_id/:user_id`
 - GET `/access`
 - GET `/access/~`
 - POST `/access`
 - GET `/location`
 - POST `/location`
 - DELETE `/location/:location_id`
 - PATCH `/location/:location_id`
 - POST `/work`

## POST `/user`

A quick way to create more users.

### Require

| Name      | Type   | About                                             |
| --------- | ------ | ------------------------------------------------- |
| firstname | String | The first name of the user.                       |
| lastname  | String | The last name of the user.                        |
| username  | String | The login name of the user.                       |
| group_id  | Number | The group_id for that user.                       |
| password  | String | The password of the user. (Please make it strong) |

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | --------------------------------------------------------- |
| status  | Number | The HTTP status code.                                     |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| user_id | Number | The user_id for the create user                           |

### Example

```http
POST /user HTTP/1.1
Host: localhost
Content-Type: application/json

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx

{
	"firstname": "John",
	"lastname": "Doe",
	"username": "JohnD",
	"group_id": "0"
	"password": "Str0ng!"
}
```

## GET `/user`

List all the users on the system

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<TL_user> | An array with all the users data.                            |

### Example

```http
GET /user HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/user/:user_id`

Get all the details from a single user

### Require

| Name     | Type   | About                           |
| -------- | ------ | ------------------------------- |
| :user_id | Number | The unique number for that user |
### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<TL_user> | An array with the users data                                 |

### Example

```http
GET /user/:user_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## DELETE `/user/:user_id`

Get a single user

### Require

| Name     | Type   | About                           |
| -------- | ------ | ------------------------------- |
| :user_id | Number | The unique number for that user |

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
DELETE /user/:user_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## PATCH `/user/:user_id`

Update a users info

### Require

| Name     | Type   | About                           |
| -------- | ------ | ------------------------------- |
| :user_id | Number | The unique number for that user |
| `column` | String | `Data`													|

#### Options
 - firstname
 - lastname
 - username
 - password

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
PATCH /user/:user_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## POST `/api`

Create a new apiKey

### Require

| Name       | Type   | About                                        |
| ---------- | ------ | -------------------------------------------- |
| username   | String | Your username.                               |
| password   | String | Your password.                               |
| deviceName | String | A name for that device you are logging into. |

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| apiKey  | String | Your new apiKey for that device.                             |

### Example

```http
POST /api HTTP/1.1
Host: localhost
Content-Type: application/json

{
	"username": "JohnD",
	"password": "Str0ng!",
	"deviceName": "John his device"
}
```

## GET `/api`

List all you apiKeys and deviceNames

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<TL_api> | An array with all the infomation.                     |

### Example

```http
GET /api HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/api/:api_id`

List a single api key

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<TL_api> | An array with all the infomation.                     |

### Example

```http
GET /api/:api_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## DELETE `/api/:api_id`

Remove a single api key

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
DELETE /api/:api_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/group`

List all the groups

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<TL_group> | An array with all the infomation.                     |

### Example

```http
GET /api HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## POST `/group`

Create a new group

### Require

| Name      | Type   | About                      |
| --------- | ------ | -------------------------- |
| groupName | String | The name of the group      |

### Result

| Name     | Type   | About                              |
| -------- | ------ | ---------------------------------- |
| group_id | Number | The id of the newly created group. |

### Example

```http
POST /group HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/group/:group_id`

Get all the details from a single group

### Require

| Name      | Type   | About                             |
| --------- | ------ | --------------------------------- |
| :group_id | Number | The unique number for that group. |

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | TL_group | An array with the users data                                 |

### Example

```http
GET /group/:group_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## DELETE `/group/:group_id`

Remove a group from the system.
If a user still in that group. He will be moved to the default group (group_id = 0).

### Require

| Name      | Type   | About                              |
| --------- | ------ | ---------------------------------- |
| :group_id | Number | The unique number for that group.  |
### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
DELETE /group/:group_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## PATCH `/group/:group_id`

Edit the name of a group

### Require

| Name      | Type   | About                             |
| --------- | ------ | --------------------------------- |
| :group_id | Number | The unique number for that group. |
| groupName | String | The new name of that group.       |

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
PATCH /group/:group_id HTTP/1.1
Host: localhost
Content-Type: application/json

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx

{
	"groupName": "The name"
}
```

## POST `/group/:group_id/:user_id`

Add a user to a group

### Require

| Name      | Type   | About                             |
| --------- | ------ | --------------------------------- |
| :group_id | Number | The unique number for that group. |
| :user_id  | Number | The user id.								       |

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
PATCH /group/:group_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/access`

List all the access of all the groups

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array    | An array of data.                                            |

### Example

```http
GET /access
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/access/~`

List your access

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array    | An array of data.                                            |

### Example

```http
GET /access/~
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## POST `/access`

Give a group access to a function

### Require

| Name      | Type   | About                                 |
| --------- | ------ | ------------------------------------- |
| group_id  | Number | The group_id you want to give access. |
| method    | String | The method of the function.           |
| url       | String | The url of the function.              |

### Result

| Name    | Type     | About                                                        |
| ------- | -------- | ------------------------------------------------------------ |
| status  | Number   | The HTTP status code.                                        |
| message | String   | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
GET /access
Host: localhost
Content-Type: application/json

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx

{
	"group_id": 2,
	"method": "post",
	"url": "/access"
}
```


## GET `/location`

List all the locations on the system

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<object>  | An array with all the users data.                            |

### Example

```http
GET /location HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## POST `/location`

A quick way to create more locations.

### Require

| Name  | Type   | About                  |
| ----- | ------ | ---------------------- |
| name  | String | Name of the place.     |
| place | String | Location of the place. |
| id    | String | Internal ID.           |

### Result

| Name        | Type   | About                                                        |
| ----------- | ------ | --------------------------------------------------------- |
| status      | Number | The HTTP status code.                                     |
| message     | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| location_id | Number | The location_id for the create location                           |

### Example

```http
POST /location HTTP/1.1
Host: localhost
Content-Type: application/json

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx

{
	"name": "John",
	"place": "John Town",
	"id": "0"
}
```

## DELETE `/location/:location_id`

Delete a single location

### Require

| Name         | Type   | About                           |
| ------------ | ------ | ------------------------------- |
| :location_id | Number | The unique number for that user |

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
DELETE /location/:location_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## PATCH `/location/:location_id`

Update a location info

### Require

| Name         | Type   | About                                |
| ------------ | ------ | ------------------------------------ |
| :location_id | Number | The unique number for that location. |
| `column`     | String | `Data`                               |

#### Options
 - name
 - place
 - id

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
PATCH /location/:location_id HTTP/1.1
Host: localhost

Authorization: Bearer
	xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## POST `/work`

Add a work object in the database

### Require

| Name        | Type   | About                  |
| ----------- | ------ | ---------------------- |
| location_id | Number | The id for a location. |
| time        | Time   | The time. (hhh:mm:ss)  |
| date        | Date   | The date. (yyyy:mm:dd) |
| description | String | The discription.       |

### Example

```http
POST /work HTTP/1.1
Host: localhost:55565
Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxx
Content-Type: application/json

{
    "location_id": "5",
    "time": "0:00:00",
    "date": "2020-01-01",
    "description": "I have done nothing at all."
}
```

## GET `/work/user/:user_id`

Able to list an users work

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<object>  | An array with all the users data.                            |

### Example

```http
GET /work/user/~ HTTP/1.1
Host: localhost:55565
Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxx
```

## GET `/work/user/:user_id/:start/:end`

Able to list an users work in a time

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array<object>  | An array with all the users data.                            |

### Example

```http
GET /work/user/~ HTTP/1.1
Host: localhost:55565
Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxx
```

# 

>  Copyright 2020 Wjtje
>
>  See the LICENSE

