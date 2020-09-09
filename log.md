# New in this version

 - Added nocache
 - New function workTypes

# Changed in this version

# Things that are fixed

 - Don't show hidden locations
 - Added a rate limiter
 - Fixed Database query built from user-controlled sources

# SQL changes
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
