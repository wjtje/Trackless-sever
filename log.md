# New in this version

 - List the total time recorded by each location

# Changed in this version

# Things that are fixed

 - Fixed the sort

# Things that are removed

 - All deprecated commands are removed

# SQL changes

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
```