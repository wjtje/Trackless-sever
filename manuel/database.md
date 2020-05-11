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



>  Copyright 2020 Wjtje
>
>  See the LICENSE

