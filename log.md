# New in this version

 - Added standardx for testing
 - Able to sort your result by propertie
 - Ablt to list your own access

# Changed in this version

 - If a location is in use and it gets delete all the work will be updated to say that the location has been deleted.
To make this work you need to run the following commands on the database.
```sql
INSERT INTO `TL_locations` (`name`, `place`, `id`) VALUES ('Deleted', 'Deleted', 'Deleted');
UPDATE `TL_locations` SET `locationId` = 0 WHERE `TL_locations`.`id` = 'Deleted';
```
 - When a user gets deleted all the work from that user will be lost
 - When deleting a group all access rules for that group will be deleted

# Things that are fixed

 - An empty string in no longer valid
