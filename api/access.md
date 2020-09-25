# List of access codes

## Access

### trackless.access.readAll

 - GET: /access
 - GET: /access/{accessID}
 - GET: /group/{groupID}/access
 - GET: /user/{userID}/access

### trackless.access.readOwn

 - GET: /user/~/access

### trackless.access.create

 - POST: /access
 - POST: /gtoup/{groupID}/access

### trackless.access.remove

 - DELETE: /access/{accessID}

## Api

### trackless.api.read

 - GET: /api
 - GET: /api/{apiID}

### trackless.api.remove

 - DELETE: /api/{apiID}

## Group

### trackless.group.read

 - GET: /group
 - GET: /group/{groupID}
 - GET: /group/{groupID}/user

### trackless.group.create

 - POST: /group

### trackless.group.remove

 - DELETE: /group/{groupID}

### trackless.group.edit

 - PATCH: /group/{groupID}

### trackless.group.add

 - POST: /group/{groupID}/user

## Location

### trackless.location.read

 - GET: /location
 - GET: /location/{locationID}

### trackless.location.create

 - POST: /location

### trackless.location.remove

 - DELETE: /location/{locationID}

### trackless.location.edit

 - PATCH: /location/{locationID}

## User

### trackless.user.readAll

 - GET: /user
 - GET: /user/{userID}

### trackless.user.readOwn

 - GET: /user/~

### trackless.user.create

 - POST: /user

### trackless.user.remove

 - DELETE: /user/{userID}

### trackless.user.editAll

 - PATCH: /user/{userID}

### trackless.user.editOwn

 - PATCH: /user/~

## Work

### trackless.work.readAll

 - GET: /user/{userId}/work
 - GET: /user/{userId}/work/{workID}

### trackless.work.readOwn

 - GET: /user/~/work
 - GET: /user/~/work/{workID}

### trackless.work.editAll

 - PATCH: /user/{userID}/work/{workID}

### trackless.work.editOwn

 - PATCH: /user/~/work/{workID}

### trackless.work.createOwn

 - POST: /user/~/work

### trackless.work.createAll

 - POST: /user/{userID}/work
 - POST: /work

## Worktype

### trackless.worktype.read

 - GET: /worktype
 - GET: /worktype/{worktypeID}

### trackless.worktype.create

 - POST: /worktype

### trackless.worktype.remove

 - DELETE: /worktype/{worktypeID}

### trackless.worktype.edit

 - PATCH: /worktype/{worktypeID}
