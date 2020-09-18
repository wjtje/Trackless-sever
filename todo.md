# To-Do

Global To-Do files
Use todo+ to see inline todo's

## Longterm

 - A way to see changes made to the database (v0.5-beta.1)
 - A better way to create all the tabels (On first launch)
 - A way to only allow some device. (example: The admin says that you can only have 2 devices at once)
 - /work/user/:userId (DELETE) will not respond anything
 - A way to sort on multiple properties
 - Give the api better description including the required access
 - Add more tags
 - Replace Id with ID

## Now

 - Remove all deprecated (v0.4.5)

### Desing

 - /user/{userId}/work:
    - POST
    - GET
 - /user/{userId}/work/{workId}:
    - GET
    - PATCH
    - DELETE
 - /user/{userId}/work/date/{start}/{end}:
    - GET

 - /user/{userId}/location/last:
    - GET
 - /user/{userId}/location/most:
    - GET

 - /work:
    - GET
    - POST
 - /work/{workId}:
    - GET
    - PATCH
    - DELETE
 - /work/date/{start}/{end}:
    - GET

### Code

 - /group/{groupId}/user:
    - GET
    - POST
 - /group/{groupId}/access:
    - GET
    - POST

 - /user/{userId}/access:
    - GET

 - /user/{userId}/work:
    - POST
    - GET
 - /user/{userId}/work/{workId}:
    - GET
    - PATCH
    - DELETE
 - /user/{userId}/work/date/{start}/{end}:
    - GET

 - /user/{userId}/location/last:
    - GET
 - /user/{userId}/location/most:
    - GET

 - /work:
    - GET
    - POST
 - /work/{workId}:
    - GET
    - PATCH
    - DELETE
 - /work/date/{start}/{end}:
    - GET
