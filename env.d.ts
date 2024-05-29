declare namespace NodeJS {
  interface ProcessEnv {
    BASE_PATH?: string;
    CLUSTERING: string;
    LOG_LEVEL?: string;
    NODE_ENV: string;
    PORT: string;
  }
}

declare namespace Express {
  export interface Request {
    user: any; 
  }

  export interface Response {
    user: any;
  }
}

