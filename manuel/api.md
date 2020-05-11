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

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | --------------------------------------------------------- |
| status  | Number | The HTTP status code.                                     |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |

### Example

```http
POST /user/create HTTP/1.1
Host: localhost
Content-Type: application/json

{
	"firstname": "John",
	"lastname": "Doe",
	"username": "JohnD",
	"password": "Str0ng!"
}
```

## GET  `/user`

List all the users on the system

### Require

Nothing

### Result

| Name    | Type   | About                                                        |
| ------- | ------ | ------------------------------------------------------------ |
| status  | Number | The HTTP status code.                                        |
| message | String | A custom message what happened.<br/>It is usually `done`.<br />But if it's anything else, something's gone wrong. |
| result  | Array  | An array with the users data.                                |

### Example

```http
GET /user HTTP/1.1
Host: localhost
```


>  Copyright 2020 Wjtje
>
>  See the LICENSE

