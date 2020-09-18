# New in this version

 - Create a new table for settings
 - Created a new settingsHandler for importing the settings for the user
 - New setting `workLateDays`: how any days late you can enter or edit work

# Changed in this version

 - groupId 0 doesnt exist any longer exsist
 - Id -> ID (It has been done)

# Things that are fixed

# SQL changes

```sql
UPDATE `TL_groups` SET `groupId` = '2' WHERE `TL_groups`.`groupId` = 1;
UPDATE `TL_users` SET `groupId` = '2' WHERE `TL_users`.`groupId` = 1;
UPDATE `TL_groups` SET `groupId` = '1' WHERE `TL_groups`.`groupId` = 0;
UPDATE `TL_users` SET `groupId` = '1' WHERE `TL_users`.`groupId` = 0;

CREATE TABLE `trackless`.`TL_settings` (
  `settingId` INT NOT NULL AUTO_INCREMENT ,
  `groupId` INT NOT NULL ,
  `setting` TEXT NOT NULL ,
  `value` TEXT NOT NULL ,
  PRIMARY KEY (`settingId`)
) ENGINE = InnoDB;

ALTER TABLE `TL_settings` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `TL_access` CHANGE `accessId` `accessID` INT NOT NULL AUTO_INCREMENT, CHANGE `groupId` `groupID` INT NOT NULL;
ALTER TABLE `TL_apikeys` CHANGE `apiId` `apiID` INT NOT NULL AUTO_INCREMENT, CHANGE `userId` `userID` INT NOT NULL;
ALTER TABLE `TL_errors` CHANGE `errorId` `errorID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_groups` CHANGE `groupId` `groupID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_locations` CHANGE `locationId` `locationID` INT NOT NULL AUTO_INCREMENT;
ALTER TABLE `TL_settings` CHANGE `settingId` `settingID` INT NOT NULL AUTO_INCREMENT, CHANGE `groupId` `groupID` INT NOT NULL;
ALTER TABLE `TL_users` CHANGE `userId` `userID` INT NOT NULL AUTO_INCREMENT, CHANGE `groupId` `groupID` INT NOT NULL DEFAULT 1;
ALTER TABLE `TL_work` CHANGE `workId` `workID` INT NOT NULL AUTO_INCREMENT, CHANGE `userId` `userID` INT NOT NULL, CHANGE `locationId` `locationID` INT NOT NULL, CHANGE `worktypeId` `worktypeID` INT NOT NULL;
ALTER TABLE `TL_worktype` CHANGE `worktypeId` `worktypeID` INT NOT NULL AUTO_INCREMENT;
```