# web-api-template
Typescript REST and GraphQL API template with JWT authentication

[here](https://github.com/peymanAzad/create-web-api) is code generator for this project
## Quick Start

```bash
npx create-web-api <project-name>
```
then 
```bash
cd <project-name>
yarn install
yarn build
yarn start
```
## Used libraries

- [typescript](https://www.typescriptlang.org/)
- [express](https://expressjs.com/)
- [typeorm](https://typeorm.io/)
- [argon2](https://github.com/ranisalt/node-argon2)
- [json web token](https://github.com/auth0/node-jsonwebtoken)

 **Graphql**
- [apollo](https://www.apollographql.com/)
- [type graphql](https://typegraphql.com/)
- [class validator](https://github.com/typestack/class-validator)

 **REST**
- [yup](https://github.com/jquense/yup)

## Commands

Starting app:

```bash
yarn start
```
Starting with nodemon
```bash
yarn startd
```
Debuging:
```bash
yarn debug
```
Typescript build:
```bash
yarn build
```
Typescript build (watch mode):
```bash
yarn watch
```
Creating typeorm migration
```bash
yarn migration:create
```
## Environment Variables

The environment variables file can be found and modified in the `.env` in root of porject.

```bash
# Port number
PORT=4000

# JWT
# JWT access token secret key
ACCESS_TOKEN_SECRET=ajlkqowieuqowueoi
# JWT refresh token secret key (use different secrets for refresh and access tokens)
REFRESH_TOKEN_SECRET=qopwieioque1
# access token expiry (default 15 minutes)
ACCESS_TOKEN_EXPIRY=15m
# refresh token expiry (default 7 days)
REFRESH_TOKEN_EXPIRY=7d
# refresh token cookie name
REFRESH_TOKEN_COOKIE_NAME=jid

# CORS 
# you can set cors for client your application
CORS_CLIENT_HOST=http://localhost:3000
```

## Project Structure
```
src\
 |--entities\             # data layer (model)
 |--dataAccess\           # data access layer (repos and migrations)
 |--services\             # service layer (pure app logic)
 |--services.contracts\   # types and interfaces for service layer
 |--host\                 # application host layer
   |--auth\               # authentication system with jwt
   |--graphql\            # all files related to graphql (if selected in cli)
   |--restApi\            # all files related to rest (if selected in cli)
   |--app.ts              # express app 
 |--ormconfig.json        # database config file
 |--Dockerfile            # docker file
 |--.nev                  # environment variables file
 |--index.ts              # application entry point
 
```

## Routes
`POST /refresh_token` - get new tokens\
`POST /revoke_refresh_token` - revoke refresh token\
\
 **REST**\
`POST /register body:{username,password,confirmPassword}` - registers new user and sends access_token\
`POST /login body:{username,password}` - authenticates user and sends access_token\
`GET  /login` - current user information\
`DELETE /login` - logout current user\
\
 **GraphQL**\
`POST /graphql` - graphql api (see graphql docs for register, login, logout)

## authentication
I almost copied it from [benawad auth example project](https://github.com/benawad/jwt-auth-example)
