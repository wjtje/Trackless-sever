# New in this version

 - authHandler: A quick way to auth a user in a express route
 - requireHandler: A quick way to check if all the info is in the body
 - serverErrorHandler: Handels every server error
 - groupIdCheckHandler: Checks if a groupId exsist
 - userIdCheckHandler: Checks if a userId exsist
 - apiIdCheckHandler: Checks if a apiId exsist
 - accessIdCheckHandler: Checks if a accessId exsist
 - locationIdCheckHandler: Checks if a locationId exsist
 - workIdCheckHandler: Checks if a workId exsist
 - Added typescript interfaces for client side

# Changed in this version

 - request.user has now typescipt support
 - Cleaner openapi documentation
 - Renamed all the id's (group_id to groupId etc.)

# Things that are fixed

 - types: fixed a bug where null was valid for a string
