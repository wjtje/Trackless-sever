# [0.4.7]

* Fixed the dev command
* Use winston to track errors

# Online API [0.4.6]

## New in this version

 - Able to sort on multiple properties
 - Added the docs route for [online api](https://www.trackless.ga/api) support
 - Added support for limit and offset

## Changed in this version

 - Added environment variables
 - Get version from package.json

# SQL views [0.4.5]

## New in this version

 - List the total time recorded by each location
 - The database will check if the combination groupID and setting in unique
 - Added full utf-8 text support to the desciption and deviceName
 - The system now checks if you are using valid values

## Changed in this version

 - Some values in the database now uses base64. Run the `upgrade/base64.ts` to upgrade.

## Things that are fixed

 - Fixed the sort
 - It is now impossible to store two users with the same username

## Things that are removed

 - All deprecated commands are removed
 - Every error now has a response

## SQL changes

```sql
-- Create a view for selecting all the locations with the total time
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
FROM TL_locations L

-- Create a view for selecting all the work
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
INNER JOIN `TL_groups` USING(`groupID`)

-- Make the username row uniqe inside the database
ALTER TABLE `TL_users` CHANGE `username` `username` VARCHAR(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;
ALTER TABLE `trackless`.`TL_users` ADD UNIQUE (`username`);

-- Make sure that the combination groupID and setting is unique
ALTER TABLE `TL_settings` CHANGE `setting` `setting` VARCHAR(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL;
ALTER TABLE `trackless`.`TL_settings` ADD UNIQUE (`groupID`, `setting`);
```

# SQL keys [0.4.4]

## New in this version

 - Create a new table for settings
 - Created a new settingsHandler for importing the settings for the user
 - New setting `workLateDays`: how many days late you can enter or edit work
 - New `access.md` file for checking what access you need
 - Added a lot of new commands

## Changed in this version

 - groupID 0 doesn't exist any longer
 - Id -> ID (It has been done)
 - Changed the way sortHandler saves the request

## Things that are fixed

 - Checks if a Float is correct
 - Checks if an Int is not a Float
 - Table TL_work now stores time correct

## Things that are removed

 - You can not use ~ to list your own group

## SQL changes

```sql
-- Change the groupID
UPDATE `TL_groups` SET `groupId` = '2' WHERE `TL_groups`.`groupId` = 1;
UPDATE `TL_users` SET `groupId` = '2' WHERE `TL_users`.`groupId` = 1;
UPDATE `TL_groups` SET `groupId` = '1' WHERE `TL_groups`.`groupId` = 0;
UPDATE `TL_users` SET `groupId` = '1' WHERE `TL_users`.`groupId` = 0;

-- Create new table

CREATE TABLE `trackless`.`TL_settings` (
  `settingID` INT NOT NULL AUTO_INCREMENT ,
  `groupID` INT NOT NULL ,
  `setting` TEXT NOT NULL ,
  `value` TEXT NOT NULL ,
  PRIMARY KEY (`settingId`)
) ENGINE = InnoDB;

-- Change Id -> ID

ALTER TABLE `TL_access` CHANGE `accessId` `accessID` INT NOT NULL AUTO_INCREMENT, CHANGE `groupId` `groupID` INT NOT NULL;
ALTER TABLE `TL_apikeys` CHANGE `apiId` `apiID` INT NOT NULL AUTO_INCREMENT, CHANGE `userId` `userID` INT NOT NULL;
ALTER TABLE `TL_errors` CHANGE `errorId` `errorID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_groups` CHANGE `groupId` `groupID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_locations` CHANGE `locationId` `locationID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_users` CHANGE `userId` `userID` INT NOT NULL AUTO_INCREMENT, CHANGE `groupId` `groupID` INT NOT NULL DEFAULT 1;
ALTER TABLE `TL_work` CHANGE `workId` `workID` INT NOT NULL AUTO_INCREMENT, CHANGE `userId` `userID` INT NOT NULL, CHANGE `locationId` `locationID` INT NOT NULL, CHANGE `worktypeId` `worktypeID` INT NOT NULL;
ALTER TABLE `TL_worktype` CHANGE `worktypeId` `worktypeID` INT NOT NULL AUTO_INCREMENT;

-- PLEASE REMOVE ALL RELATIONS
-- BEVORE RUNNING THERE COMMANDS
ALTER TABLE `TL_access` ADD FOREIGN KEY (`groupID`) REFERENCES `TL_groups`(`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_apikeys` ADD FOREIGN KEY (`userID`) REFERENCES `TL_users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_users` ADD FOREIGN KEY (`groupID`) REFERENCES `TL_groups`(`groupID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`locationID`) REFERENCES `TL_locations`(`locationID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`userID`) REFERENCES `TL_users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`worktypeID`) REFERENCES `TL_worktype`(`worktypeID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_settings` ADD FOREIGN KEY (`groupID`) REFERENCES `TL_groups`(`groupID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Better way to store time

ALTER TABLE `TL_work` CHANGE `time` `time` FLOAT(4,2) NOT NULL;
```

# Added worktypes [0.4.3]

## New in this version

 - Added nocache
 - New function workTypes

## Things that are fixed

 - Don't show hidden locations
 - Added a rate limiter
 - Fixed Database query built from user-controlled sources

## SQL changes

```sql
CREATE TABLE `TL_worktype` (
  `worktypeId` INT NOT NULL AUTO_INCREMENT ,
  `name` TEXT NOT NULL ,
  PRIMARY KEY (`worktypeId`)
) ENGINE = InnoDB;
ALTER TABLE `TL_work` ADD `worktypeId` INT NOT NULL AFTER `locationId`;
INSERT INTO `TL_worktype` (`name`) VALUES ('Normaal');
UPDATE `TL_work` SET `worktypeId`=1 WHERE `worktypeId`=0;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`worktypeId`) REFERENCES `TL_worktype`(`worktypeId`) ON DELETE RESTRICT ON UPDATE CASCADE;
```

# Better testing [0.4.2]

## New in this version

 - Added standardx for testing
 - Able to sort your result by propertie
 - Able to list your own access
 - Able to hide locations

## Changed in this version

 - When a user gets deleted all the work from that user will be lost!
 - When deleting a group all access rules for that group will be deleted!
 - A group can not be delted when there are users in that group!
 - A location can not be removed if its in use!
 - Better error codes

## Things that are fixed

 - An empty string in no longer valid

## SQL changes

```sql
ALTER TABLE `TL_errors` DROP `userId`;
ALTER TABLE `TL_access` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_apikeys` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_users` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`locationId`) REFERENCES `TL_locations`(`locationId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_locations` ADD `hidden` BOOLEAN NOT NULL DEFAULT FALSE AFTER `locationId`;
```

# Fixed crashes [0.4.1]

## New in this version

  - Use can use the PORT environment variable to change the port from the default 55565
  - Added morgan for better logging in the terminal

## Changed in this version

 - Added new devDependencies
 - moved bdUser info to new file
 - App does not crash if not connected to a database
 - App shows correct error when port is in use

# Big release [0.4.0]

## New in this version

 - authHandler: A quick way to auth a user in a express route
 - requireHandler: A quick way to check if all the info is in the body
 - serverErrorHandler: Handels every server error
 - groupIdCheckHandler: Checks if a groupId exsist
 - userIdCheckHandler: Checks if a userId exsist
 - apiIdCheckHandler: Checks if a apiId exsist
 - accessIdCheckHandler: Checks if a accessId exsist
 - locationIdCheckHandler: Checks if a locationId exsist
 - workIdCheckHandler: Checks if a workId exsist
 - Added typescript interfaces for client side

## Changed in this version

 - request.user has now typescipt support
 - Cleaner openapi documentation
 - Renamed all the id's (group_id to groupId etc.)
 - Updated firstrun.sql

## Things that are fixed

 - types: fixed a bug where null was valid for a string
