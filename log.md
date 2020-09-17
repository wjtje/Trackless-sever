# New in this version

 - Create a new table for settings

# Changed in this version

 - groupId 0 doesnt exist any longer exsist

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
```