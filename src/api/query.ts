// Copyright (c) 2020 Wouter van der Wal

// Get all users
export const getAllUsers = 'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) ORDER BY `firstname`, `lastname`, `username`'
export const getUsers = 'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) WHERE `groupId`=? ORDER BY `firstname`, `lastname`, `username`'
export const getUser = 'SELECT `userId`, `firstname`, `lastname`, `username`, `groupId`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`groupId`) WHERE `userId`=?'
