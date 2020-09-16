/* Copyright (c) 2020 Wouter van der Wal */

CREATE TABLE `trackless`.`TL_users` (
  `userId` INT NOT NULL AUTO_INCREMENT ,
  `firstname` TEXT NOT NULL ,
  `lastname` TEXT NOT NULL ,
  `username` TEXT NOT NULL ,
  `groupId` int NOT NULL DEFAULT '0',
  `salt_hash` TEXT NOT NULL ,
  `hash` TEXT NOT NULL ,
  PRIMARY KEY (`userId`)
) ENGINE = InnoDB;

/* Creates a user called admin with the password admin. */
INSERT INTO `trackless`.`TL_users` (`firstname`, `lastname`, `username`, `groupId`, `salt_hash`, `hash`) VALUES ('admin', 'admin', 'admin', 1, 'U736OMcfzID8YsBX', '499e653fc45c668794047f56c298ed213594863a1d18683ea07ae5efe972f9f8');

CREATE TABLE `trackless`.`TL_errors` (
    `errorId` INT NOT NULL AUTO_INCREMENT ,
    `dateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `error_code` LONGTEXT NOT NULL ,
    `error_message` LONGTEXT NOT NULL ,
    PRIMARY KEY (`errorId`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_apikeys` (
  `apiId` INT NOT NULL AUTO_INCREMENT ,
  `apiKey` TEXT NOT NULL ,
  `createDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `lastUsed` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `deviceName` TEXT NOT NULL ,
  `userId` INT NOT NULL ,
  PRIMARY KEY (`apiId`)
) ENGINE = InnoDB;

CREATE TABLE `trackless`.`TL_groups` (
  `groupId` INT NOT NULL AUTO_INCREMENT ,
  `groupName` TEXT NOT NULL ,
  PRIMARY KEY (`groupId`)
) ENGINE = InnoDB;

/* Creates the groups */
INSERT INTO `trackless`.`TL_groups` (`groupId`, `groupName`) VALUES (1, 'Default');
INSERT INTO `trackless`.`TL_groups` (`groupId`, `groupName`) VALUES (2, 'Admin');

CREATE TABLE `trackless`.`TL_access` (
  `accessId` INT NOT NULL AUTO_INCREMENT ,
  `groupId` INT NOT NULL ,
  `access` TEXT NOT NULL ,
  PRIMARY KEY (`accessId`)
) ENGINE = InnoDB;

/* Gives the admin group access to give access */
INSERT INTO `trackless`.`TL_access` (`groupId`, `access`) VALUES (1, 'trackless.access.create');

CREATE TABLE `trackless`.`TL_locations` (
  `locationId` INT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  `place` TEXT NOT NULL ,
  `id` TEXT NOT NULL ,
  PRIMARY KEY (`locationId`)
) ENGINE = InnoDB;

/* Create a location for deleted locations */
INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES ('Deleted', 'Deleted', 'Deleted');
UPDATE `TL_locations` SET `locationId` = 0 WHERE `TL_locations`.`id` = 'Deleted';

CREATE TABLE `trackless`.`TL_work` (
  `workId` INT NOT NULL AUTO_INCREMENT ,
  `userId` INT NOT NULL ,
  `locationId` INT NOT NULL ,
  `time` TIME NOT NULL ,
  `date` DATE NOT NULL ,
  `description` TEXT NOT NULL ,
  PRIMARY KEY (`workId`)
) ENGINE = InnoDB;

/* Add FOREIGN KEYS */
ALTER TABLE `TL_access` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_apikeys` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_users` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`locationId`) REFERENCES `TL_locations`(`locationId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
