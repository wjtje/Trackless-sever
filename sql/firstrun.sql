CREATE DATABASE `trackless`;

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

CREATE TABLE `trackless`.`TL_errors` (
    `error_id` INT NOT NULL AUTO_INCREMENT ,
    `dateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `user_id` INT NOT NULL,
    `error_code` LONGTEXT NOT NULL ,
    `error_message` LONGTEXT NOT NULL ,
    PRIMARY KEY (`error_id`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_apikeys` (
  `api_id` INT NOT NULL AUTO_INCREMENT ,
  `apiKey` TEXT NOT NULL ,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `lastUsed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `deviceName` TEXT NOT NULL ,
  `user_id` INT NOT NULL ,
  PRIMARY KEY (`api_id`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT ,
  `groupName` TEXT NOT NULL ,
  PRIMARY KEY (`group_id`)
) ENGINE = InnoDB;

INSERT INTO `TL_groups` (`group_id`, `groupName`) VALUES (1, 'Default');
INSERT INTO `TL_groups` (`group_id`, `groupName`) VALUES (2, 'Admin');

UPDATE `TL_groups` SET `group_id` = 0 WHERE `TL_groups`.`groupName` = 'Default';
UPDATE `TL_groups` SET `group_id` = 1 WHERE `TL_groups`.`groupName` = 'Admin';

CREATE TABLE `trackless`.`TL_access` (
  `access_id` INT NOT NULL AUTO_INCREMENT ,
  `group_id` INT NOT NULL ,
  `access` TEXT NOT NULL ,
  PRIMARY KEY (`access_id`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_locations` (
  `location_id` INT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  `place` TEXT NOT NULL ,
  `id` TEXT NOT NULL ,
  PRIMARY KEY (`location_id`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_work` (
  `work_id` INT NOT NULL AUTO_INCREMENT ,
  `user_id` INT NOT NULL ,
  `location_id` INT NOT NULL ,
  `time` TIME NOT NULL ,
  `date` DATE NOT NULL ,
  `description` TEXT NOT NULL ,
  PRIMARY KEY (`work_id`)
) ENGINE = InnoDB;