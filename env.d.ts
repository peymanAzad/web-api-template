declare namespace NodeJS {
  interface ProcessEnv {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRY_MINUTE: string;
    REFRESH_TOKEN_EXPIRY_DAY: string;
    REFRESH_TOKEN_COOKIE_NAME: string;
    CORS_CLIENT_HOST: string;
    PORT: string;
  }
}