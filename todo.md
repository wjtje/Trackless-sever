# To-Do

Global To-Do files
Use todo+ to see inline todo's

## Longterm

 - A way to see changes made to the database (v0.5-beta.1)
 - A better way to create all the tabels (On first launch)
 - A way to only allow some device. (example: The admin says that you can only have 2 devices at once)
 - /work/user/:userId (DELETE) will not respond anything
 - A way to sort on multiple properties and limit / offset support
 - Give the api better description including the required access
 - A better way to connect to the database

## Now

 - Remove all deprecated (v0.4.5)

### Desing

 - /setting:
    - GET
    - POST
 - /setting/{settingID}:
    - GET
    - PATCH
    - DELETE

 - /group/setting:
    - GET
    - POST

 - /user/setting:
    - GET

### Code

 - /group/{groupId}/access:
    - GET
    - POST

 - /user/{userId}/access:
    - GET

 - /user/{userId}/work/{workId}:
    - PATCH
    - DELETE

 - /user/{userId}/location:
    - GET

 - /work:
    - GET
 - /work/{workId}:
    - GET
    - PATCH
    - DELETE

 - /setting:
    - GET
    - POST
 - /setting/{settingID}:
    - GET
    - PATCH
    - DELETE

 - /group/setting:
    - GET
    - POST

 - /user/setting:
    - GET
