# API commands

All the 'know' commands.

## POST: `/user/create`

A quick way to create more users.

### Require

| Name      | Type   | About                                             |
| --------- | ------ | ------------------------------------------------- |
| firstname | String | The first name of the user.                       |
| lastname  | String | The last name of the user.                        |
| username  | String | The login name of the user.                       |
| password  | String | The password of the user. (Please make it strong) |
| apiKey    | String | Your own apiKey to log in.                        |

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | --------------------------------------------------------- |
| status  | Number | The HTTP status code.                                     |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| user_id | Number | The user_id for the create user                           |

### Example

```http
POST /user/create HTTP/1.1
Host: localhost
Content-Type: application/json

{
	"firstname": "John",
	"lastname": "Doe",
	"username": "JohnD",
	"password": "Str0ng!",
	"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## GET  `/user`

List all the users on the system

### Require

| Name      | Type   | About                          |
| --------- | ------ | ------------------------------ |
| apiKey    | String | Your own apiKey to log in.     |

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
Content-Type: application/json

{
	"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## GET `/user/:user_id`

Get all the details from a single user

### Require

| Name     | Type   | About                           |
| -------- | ------ | ------------------------------- |
| :user_id | Number | The unique number for that user |
| apiKey   | String | Your own apiKey to log in.      |

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
Content-Type: application/json

{
	"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## DELETE `/user/:user_id`

Get a single user

### Require

| Name     | Type   | About                           |
| -------- | ------ | ------------------------------- |
| :user_id | Number | The unique number for that user |
| apiKey   | String | Your own apiKey to log in.      |

### Result

| Name    | Type           | About                                                        |
| ------- | -------------- | ------------------------------------------------------------ |
| status  | Number         | The HTTP status code.                                        |
| message | String         | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
DELETE /user/:user_id HTTP/1.1
Host: localhost
Content-Type: application/json

{
	"apiKey": "xxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

## POST `/api/create`

Create a new apiKey

### Require

| Name       | Type   | About                                        |
| ---------- | ------ | -------------------------------------------- |
| username   | String | Your username.                               |
| password   | String | Your password.                               |
| deviceName | String | A name for that device you are logging into. |

## Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| apiKey  | String | Your new apiKey for that device.                             |

### Example

```http
POST /api/create HTTP/1.1
Host: localhost
Content-Type: application/json

{
	"username": "JohnD",
	"password": "Str0ng!",
	"deviceName": "John his device"
}
```


>  Copyright 2020 Wjtje
>
>  See the LICENSE

