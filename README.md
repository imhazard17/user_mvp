FUNCTIONALITY:-

- User, Post, Like, Comment are the db resources
- Can signup (create), login users using jwt based authentication
- Logged in users can upload images when creating posts and setting profile pictures (implemented using multer)
- One post can have maximum 7 images
- Each file can be a maximum of 3MB
- Logged in users can do CUD actions on their own posts, comments and likes (only CD for likes)
- Unauthenticated users can only perform read operations
- We can also access data about the posts of the user when we search for a user

-------------------------------------------------------------------------------------------------------------------------------------

SETUP INSTRUCTIONS:-

1) run `npm i`
2) install postgresql in your pc if not already installed. Watch this installation tutorial: https://www.youtube.com/watch?v=HmziePvMwkE
3) open `psql` using your credentials and keep the server running while testing the api
4) create .env file with apprepriate values of fields:-
![Screenshot](https://github.com/imhazard17/user_mvp/assets/57060375/29288738-1434-45a1-838d-80adf623c58d)
5) run `npx prisma migrate dev --name init`
6) run `prisma generate`
7) run `node app.js` and using postman run test the api endpoints

-------------------------------------------------------------------------------------------------------------------------------------

API ENDPOINTS:-     (NOTE: ** means it is a protected route hence should send authorization token in header)
                    (Did not include returned values for the api endpoints will do it later)

USERS:

1) GET /user/all     [get all users]
2) GET /user/my-details**    [get current logged in user]
3) GET /user/search/:username     [get user based on searched username]
4) PUT /user/change-details**        [update user details]
5) DELETE /user/delete-profile**        [delete logged in user]

AUTH:

6) POST /auth/signup      [create new user]
7) GET /auth/login     [login user]

(NOTE check which data to send in body by the schema of the resouces defined on `schema.prisma` file)
(NOTE on endpoints /user/auth/signup and /user/change-details can upload minimum 0 files and maximum 1 file with key = `file` in formData field of body on postman)
