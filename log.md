# New in this version

 - Added standardx for testing
 - Able to sort your result by propertie
 - Ablt to list your own access

# Changed in this version

 - When a user gets deleted all the work from that user will be lost!
 - When deleting a group all access rules for that group will be deleted!
 - A group can not be delted when there are users in that group!
 - A location can not be removed if its in use!
 - Better error codes

# Things that are fixed

 - An empty string in no longer valid

# SQL changes

```sql
ALTER TABLE `TL_errors` DROP `userId`;
ALTER TABLE `TL_access` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_apikeys` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TL_users` ADD FOREIGN KEY (`groupId`) REFERENCES `TL_groups`(`groupId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`locationId`) REFERENCES `TL_locations`(`locationId`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `TL_work` ADD FOREIGN KEY (`userId`) REFERENCES `TL_users`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
```
