// Get all users
export const getAllUsers = "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) ORDER BY `firstname`, `lastname`, `username`";
export const getUsers = "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `group_id`=? ORDER BY `firstname`, `lastname`, `username`";
export const getUser = "SELECT `user_id`, `firstname`, `lastname`, `username`, `group_id`, `groupName` FROM `TL_users` INNER JOIN `TL_groups` USING (`group_id`) WHERE `user_id`=?";
