/* Copyright (c) 2020 Wouter van der Wal */

START TRANSACTION;

-- Create all the tables

CREATE TABLE `TL_access` (
  `accessID` int NOT NULL AUTO_INCREMENT,
  `groupID` int NOT NULL,
  `access` text NOT NULL,
  PRIMARY KEY (`accessID`),
  KEY `groupID` (`groupID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_apikeys` (
  `apiID` int NOT NULL AUTO_INCREMENT,
  `apiKey` text NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `lastUsed` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deviceName` text NOT NULL,
  `userID` int NOT NULL,
  PRIMARY KEY (`apiID`),
  KEY `userID` (`userID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_errors` (
  `errorID` int NOT NULL AUTO_INCREMENT,
  `dateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `error_code` longtext NOT NULL,
  `error_message` longtext NOT NULL,
  PRIMARY KEY (`errorID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_groups` (
  `groupID` int NOT NULL AUTO_INCREMENT,
  `groupName` text NOT NULL,
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_locations` (
  `locationID` int NOT NULL AUTO_INCREMENT,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `name` text NOT NULL,
  `place` text NOT NULL,
  `id` text NOT NULL,
  PRIMARY KEY (`locationID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_settings` (
  `settingID` int NOT NULL AUTO_INCREMENT,
  `groupID` int NOT NULL,
  `setting` varchar(128) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`settingID`),
  UNIQUE KEY `groupID` (`groupID`,`setting`)
) ENGINE=InnoDB;

CREATE TABLE `TL_users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `username` varchar(64) NOT NULL,
  `groupID` int NOT NULL DEFAULT '1',
  `salt_hash` text NOT NULL,
  `hash` text NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  KEY `groupID` (`groupID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_work` (
  `workID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `locationID` int NOT NULL,
  `worktypeID` int NOT NULL,
  `time` float(4,2) NOT NULL,
  `date` date NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`workID`),
  KEY `locationID` (`locationID`),
  KEY `userID` (`userID`),
  KEY `worktypeID` (`worktypeID`)
) ENGINE=InnoDB;

CREATE TABLE `TL_worktype` (
  `worktypeID` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`worktypeID`)
) ENGINE=InnoDB;

-- Create the views
CREATE VIEW TL_vLocations (locationID, hidden, name, place, id, time) AS
SELECT
	L.locationID,
  L.hidden,
  L.name,
  L.place,
  L.id,
  (
    SELECT ifnull(SUM(W.time), 0)
    FROM TL_work W
    WHERE W.locationID = L.locationID
  ) as time
FROM TL_locations L;

CREATE VIEW TL_vWork AS SELECT
    workID,
    `TL_work`.`time` AS `time`,
    `date`,
    description,
    TL_users.userID AS `user.userID`,
    TL_users.firstname AS `user.firstname`,
    TL_users.lastname AS `user.lastname`,
    TL_users.username AS `user.username`,
    TL_groups.groupID AS `user.groupID`,
    TL_groups.groupName AS `user.groupName`,
    TL_vLocations.locationID AS `location.locationID`,
    TL_vLocations.hidden AS `location.hidden`,
    TL_vLocations.place AS `location.place`,
    TL_vLocations.name AS `location.name`,
    TL_vLocations.id AS `location.id`,
    TL_vLocations.time AS `location.time`,
    TL_worktype.worktypeID AS `worktype.worktypeID`,
    TL_worktype.name AS `worktype.name`
FROM
    `TL_work`
INNER JOIN `TL_users` USING(`userID`)
INNER JOIN `TL_vLocations` USING(`locationID`)
INNER JOIN `TL_worktype` USING(`worktypeID`)
INNER JOIN `TL_groups` USING(`groupID`);

-- Add foreign keys
ALTER TABLE `TL_access`
  ADD CONSTRAINT `TL_access_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `TL_groups` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TL_apikeys`
  ADD CONSTRAINT `TL_apikeys_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `TL_users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TL_settings`
  ADD CONSTRAINT `TL_settings_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `TL_groups` (`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TL_users`
  ADD CONSTRAINT `TL_users_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `TL_groups` (`groupID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `TL_work`
  ADD CONSTRAINT `TL_work_ibfk_1` FOREIGN KEY (`locationID`) REFERENCES `TL_locations` (`locationID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `TL_work_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `TL_users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `TL_work_ibfk_3` FOREIGN KEY (`worktypeID`) REFERENCES `TL_worktype` (`worktypeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Create the basic groups
INSERT INTO `TL_groups` (`groupName`) VALUES ('Default');
INSERT INTO `TL_groups` (`groupName`) VALUES ('Admin');

-- Create a basic user and give it access to give more access
INSERT INTO `TL_users` (`firstname`, `lastname`, `username`, `groupID`, `salt_hash`, `hash`) VALUES ('admin', 'admin', 'admin', 1, 'U736OMcfzID8YsBX', '499e653fc45c668794047f56c298ed213594863a1d18683ea07ae5efe972f9f8');
INSERT INTO `TL_access` (`groupID`, `access`) VALUES (1, 'trackless.access.create');

-- Save the database
COMMIT;
