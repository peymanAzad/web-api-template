# web-api-template
REST/graphql api template made with jwt authentication

[here](https://github.com/peymanAzad/create-web-api) is code generator for this project
```
npx run create-web-api my-api
cd my-api
yarn build
yarn start
```
## made with
- [typescript](https://www.typescriptlang.org/)
- [express](https://expressjs.com/)
- [typeorm](https://typeorm.io/) 
- [argon2](https://github.com/ranisalt/node-argon2)
- [json web token](https://github.com/auth0/node-jsonwebtoken)
### graphql
- [apollo](https://www.apollographql.com/)
- [type graphql](https://typegraphql.com/)
- [class validator](https://github.com/typestack/class-validator)
### REST api
- [yup](https://github.com/jquense/yup)
## routes
- /refresh_token post: for getting new token
- /revoke_refresh_token post: for revoking refresh token of user
#### rest api routes
- /register post: registers new user and sends access_token (body: {username, password, confirmPassword})
- /login get: sends current user
- /login post: authenticates user and sends access_token (body: {username, password})
- /login delete: logout current user
#### graphql
- /graphql
## authentication
I almost copied it from [benawad auth example project](https://github.com/benawad/jwt-auth-example)
