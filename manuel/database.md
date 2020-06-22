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
| group_ID  | INT  | index of the group.                                    |
| salt_hash | TEXT | An unique string for storing the password hash         |
| hash      | TEXT | An sha512 hash of the password including the salt_hash |

### Code

```sql
CREATE TABLE `trackless`.`TL_users` (
  `user_id` INT NOT NULL AUTO_INCREMENT ,
  `firstname` TEXT NOT NULL ,
  `lastname` TEXT NOT NULL ,
  `username` TEXT NOT NULL ,
  `group_id` int NOT NULL DEFAULT '0',
  `salt_hash` TEXT NOT NULL ,
  `hash` TEXT NOT NULL ,
  PRIMARY KEY (`user_id`)
) ENGINE = InnoDB;

INSERT INTO `TL_users` (`firstname`, `lastname`, `username`, `group_id`, `salt_hash`, `hash`) VALUES ('admin', 'admin', 'admin', 1, 'U736OMcfzID8YsBX', '499e653fc45c668794047f56c298ed213594863a1d18683ea07ae5efe972f9f8');
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
CREATE TABLE `trackless`.`TL_errors` (
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
CREATE TABLE `trackless`.`TL_apikeys` (
  `api_id` INT NOT NULL AUTO_INCREMENT ,
  `apiKey` TEXT NOT NULL ,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `lastUsed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `deviceName` TEXT NOT NULL ,
  `user_id` INT NOT NULL ,
  PRIMARY KEY (`api_id`)
) ENGINE = InnoDB;
```

## TL_groups

A table for storing the group names

### Layout

| Name      | Type | About                  |
| --------- | ---- | ---------------------- |
| group_id  | INT  | index (AUTO_INCREMENT) |
| groupName | TEXT | The name of the group. |

### Code

```sql
CREATE TABLE `trackless`.`TL_groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT ,
  `groupName` TEXT NOT NULL ,
  PRIMARY KEY (`group_id`)
) ENGINE = InnoDB;

INSERT INTO `TL_groups` (`group_id`, `groupName`) VALUES (1, 'Default');
INSERT INTO `TL_groups` (`group_id`, `groupName`) VALUES (2, 'Admin');

UPDATE `TL_groups` SET `group_id` = 0 WHERE `TL_groups`.`groupName` = 'Default';
UPDATE `TL_groups` SET `group_id` = 1 WHERE `TL_groups`.`groupName` = 'Admin';
```

## TL_access

A table for storing access to the system

### Layout

| Name      | Type | About                  |
| --------- | ---- | ---------------------- |
| access_id | INT  | index (AUTO_INCREMENT) |
| group_id  | INT  | Number of the group.   |
| method    | TEXT | Method of the request. |
| url       | TEXT | Url of the request.    |

### Code

```sql
CREATE TABLE `trackless`.`TL_access` (
  `access_id` INT NOT NULL AUTO_INCREMENT ,
  `group_id` INT NOT NULL ,
  `method` TEXT NOT NULL ,
  `url` TEXT NOT NULL ,
  PRIMARY KEY (`access_id`)
) ENGINE = InnoDB;
```

## TL_locations

A table for storing all the locations

### Layout

| Name        | Type | About                  |
| ----------- | ---- | ---------------------- |
| location_id | INT  | index (AUTO_INCREMENT) |
| name        | TEXT | Name of the place.     |
| place       | TEXT | Location of the place. |
| id          | TEXT | Internal ID.           |

### Code

```sql
CREATE TABLE `trackless`.`TL_locations` (
  `location_id` INT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  `place` TEXT NOT NULL ,
  `id` TEXT NOT NULL ,
  PRIMARY KEY (`location_id`)
) ENGINE = InnoDB;
```

## TL_work

A table for storing all the work that has been done

### Layout

| Name        | Type | About                  |
| ----------- | ---- | ---------------------- |
| work_id     | INT  | index (AUTO_INCREMENT) |
| user_id     | INT  | Who did it?            |
| location_id | INT  | Where?                 |
| time        | TIME | How long?              |
| date        | DATE | When?                  |
| description | TEXT | What?                  |

### Code

```sql
CREATE TABLE `trackless`.`TL_work` (
  `work_id` INT NOT NULL AUTO_INCREMENT ,
  `user_id` INT NOT NULL ,
  `location_id` INT NOT NULL ,
  `time` TIME NOT NULL ,
  `date` DATE NOT NULL ,
  `description` TEXT NOT NULL ,
  PRIMARY KEY (`work_id`)
) ENGINE = InnoDB;
```

#

>  Copyright 2020 Wjtje
>
>  See the LICENSE

