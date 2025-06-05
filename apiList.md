auth Router
-post /signup
-post /login
-post /logout

profileRouter
-Get /profile/view
-patch /profile/edit
-patch /profile/password

connection request router
-post /request/send/intrested/:userid
-post /request/send/ingnore/:userid
-post /requested/review/accepted/:requestid
-post /requested/review/rejected/:requestid

userRouter
-Get /user/connection
-Get /user/request
-Get /user/feed