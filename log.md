# New in this version

# Changed in this version

 - groupId 0 doesnt exist any longer exsist

# Things that are fixed

# SQL changes

```sql
UPDATE `TL_groups` SET `groupId` = '2' WHERE `TL_groups`.`groupId` = 1;
UPDATE `TL_users` SET `groupId` = '2' WHERE `TL_users`.`groupId` = 1;
UPDATE `TL_groups` SET `groupId` = '1' WHERE `TL_groups`.`groupId` = 0;
UPDATE `TL_users` SET `groupId` = '1' WHERE `TL_users`.`groupId` = 0;
```