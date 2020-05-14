# TL Datatypes

## TL_user `object`

| Name      | Type   | About                           |
| --------- | ------ | ------------------------------- |
| user_id   | Number | The unique number for that user |
| firstname | String | First name of that user         |
| lastname  | String | Last name of that user          |
| username  | String | Login name of that user         |
| group_id  | Number | Number of the group             |
| groupName | String | The name of the group           |

## TL_api `object`

| Name       | Type   | About                             |
| ---------- | ------ | --------------------------------- |
| api_id     | Number | The unique number for that apiKey |
| createDate | String | Date that the apiKey was made     |
| lastUsed   | String | Last time of use                  |
| deviceName | String | Custom name for that api key      |

## TL_group `object`

| Name      | Type   | About                            |
| --------- | ------ | -------------------------------- |
| group_id  | Number | The unique number for that group |
| groupName | String | The name of that group           |
| users     | Array<LT_user> | A list of all the users  |