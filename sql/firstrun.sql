/* Copyright (c) 2020 Wouter van der Wal */

CREATE TABLE `TL_users` (
  `userID` INT NOT NULL AUTO_INCREMENT ,
  `firstname` TEXT NOT NULL ,
  `lastname` TEXT NOT NULL ,
  `username` TEXT NOT NULL ,
  `accgroupID` int NOT NULL DEFAULT '0',
  `salt_hash` TEXT NOT NULL ,
  `hash` TEXT NOT NULL ,
  PRIMARY KEY (`userID`)
) ENGINE = InnoDB;

/* Creates a user called admin with the password admin. */
INSERT INTO `TL_users` (`firstname`, `lastname`, `username`, `accgroupID`, `salt_hash`, `hash`) VALUES ('admin', 'admin', 'admin', 1, 'U736OMcfzID8YsBX', '499e653fc45c668794047f56c298ed213594863a1d18683ea07ae5efe972f9f8');

CREATE TABLE `TL_errors` (
    `errorID` INT NOT NULL AUTO_INCREMENT ,
    `dateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `error_code` LONGTEXT NOT NULL ,
    `error_message` LONGTEXT NOT NULL ,
    PRIMARY KEY (`errorID`)
) ENGINE = InnoDB;

CREATE TABLE `TL_apikeys` (
  `apiID` INT NOT NULL AUTO_INCREMENT ,
  `apiKey` TEXT NOT NULL ,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `lastUsed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `deviceName` TEXT NOT NULL ,
  `userID` INT NOT NULL ,
  PRIMARY KEY (`apiID`)
) ENGINE = InnoDB;

CREATE TABLE `TL_groups` (
  `accgroupID` INT NOT NULL AUTO_INCREMENT ,
  `groupName` TEXT NOT NULL ,
  PRIMARY KEY (`accgroupID`)
) ENGINE = InnoDB;

/* Creates the groups */
INSERT INTO `TL_groups` (`groupName`) VALUES ('Default');
INSERT INTO `TL_groups` (`groupName`) VALUES ('Admin');

CREATE TABLE `TL_access` (
  `accessID` INT NOT NULL AUTO_INCREMENT ,
  `accgroupID` INT NOT NULL ,
  `access` TEXT NOT NULL ,
  PRIMARY KEY (`accessID`)
) ENGINE = InnoDB;

/* Gives the admin group access to give access */
INSERT INTO `TL_access` (`accgroupID`, `access`) VALUES (1, 'trackless.access.create');

CREATE TABLE `TL_locations` (
  `locationID` INT NOT NULL AUTO_INCREMENT ,
  `hidden` BOOLEAN NOT NULL DEFAULT FALSE,
  `name` TEXT NOT NULL ,
  `place` TEXT NOT NULL ,
  `id` TEXT NOT NULL ,
  PRIMARY KEY (`locationID`)
) ENGINE = InnoDB;

/* Create a location for deleted locations */
INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES ('Deleted', 'Deleted', 'Deleted');
UPDATE `TL_locations` SET `locationID` = 0 WHERE `TL_locations`.`id` = 'Deleted';

CREATE TABLE `TL_work` (
  `workID` INT NOT NULL AUTO_INCREMENT ,
  `userID` INT NOT NULL ,
  `locationID` INT NOT NULL ,
  `time` TIME NOT NULL ,
  `date` DATE NOT NULL ,
  `description` TEXT NOT NULL ,
  PRIMARY KEY (`workID`)
) ENGINE = InnoDB;

/* Create the workType table */
CREATE TABLE `TL_worktype` (
  `worktypeID` INT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  PRIMARY KEY (`worktypeID`)
) ENGINE = InnoDB;

/* Create the settings table */
CREATE TABLE `trackless`.`TL_settings` (
  `settingID` INT NOT NULL AUTO_INCREMENT ,
  `accgroupID` INT NOT NULL ,
  `setting` TEXT NOT NULL ,
  `value` TEXT NOT NULL ,
  PRIMARY KEY (`settingID`)
) ENGINE = InnoDB;

/* Add FOREIGN KEYS */
ALTER TABLE `TL_access` ADD FOREIGN KEY (`accgroupID`) REFERENCES `TL_groups`(`accgroupID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_apikeys` ADD FOREIGN KEY (`userID`) REFERENCES `TL_users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_users` ADD FOREIGN KEY (`accgroupID`) REFERENCES `TL_groups`(`accgroupID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`locationID`) REFERENCES `TL_locations`(`locationID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`userID`) REFERENCES `TL_users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_settings` ADD FOREIGN KEY (`accgroupID`) REFERENCES `TL_groups`(`accgroupID`) ON DELETE CASCADE ON UPDATE CASCADE;
