# Database layout

All the information we know about the database.

## TL_users

A table for storing the user information and login details

### Layout

| Name      | Type | About                                                  |
| --------- | ---- | ------------------------------------------------------ |
| user_id   | INT  | index (AUTO_INCREMENT)                                 |
| firstname | TEXT | Holds the first name of the user                       |
| lastname  | TEXT | Holds the last name of the user                        |
| username  | TEXT | The login name of the user                             |
| salt_hash | TEXT | An unique string for storing the password hash         |
| hash      | TEXT | An sha512 hash of the password including the salt_hash |

### Code

```sql
CREATE TABLE `trakless`.`TL_users` (
  `user_id` INT NOT NULL AUTO_INCREMENT ,
  `firstname` TEXT NOT NULL ,
  `lastname` TEXT NOT NULL ,
  `username` TEXT NOT NULL ,
  `salt_hash` TEXT NOT NULL ,
  `hash` TEXT NOT NULL ,
  PRIMARY KEY (`user_id`)
) ENGINE = InnoDB;
```

## TL_errors

A table for storing all the error details.

### Layout

| Name     | Type     | About                  |
| -------- | -------- | ---------------------- |
| error_id | INT      | index (AUTO_INCREMENT) |
| dateTime | DATETIME | CURRENT_TIME           |
| sqlError | LONGTEXT | The sql error message  |
| message  | TEXT     | User error message     |

### Code

```sql
CREATE TABLE `trakless`.`TL_errors` (
    `error_id` INT NOT NULL AUTO_INCREMENT ,
    `dateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `sqlError` LONGTEXT NOT NULL ,
    `message` TEXT NOT NULL ,
    PRIMARY KEY (`error_id`)
) ENGINE = InnoDB;
```

## TL_apikeys

A table for storing the active api keys

### Layout

| Name       | Type     | About                                                   |
| ---------- | -------- | ------------------------------------------------------- |
| api_id     | INT      | index (AUTO_INCREMENT)                                  |
| apiKey     | TEXT     | The api key                                             |
| createDate | DATETIME | CURRENT_TIME                                            |
| lastUsed   | DATETIME | Last time the api key was used                          |
| deviceName | TEXT     | A name for the api key.<br/>Like what device it is for. |
| user_id    | INT      | For who is it                                           |

### Code

```sql
CREATE TABLE `trakless`.`TL_apikeys` (
  `api_id` INT NOT NULL AUTO_INCREMENT ,
  `apiKey` TEXT NOT NULL ,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `lastUsed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `deviceName` TEXT NOT NULL ,
  `user_id` INT NOT NULL ,
  PRIMARY KEY (`api_id`)
) ENGINE = InnoDB;
```

>  Copyright 2020 Wjtje
>
>  See the LICENSE

