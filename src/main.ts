import * as passport from 'passport';
import * as session from 'express-session';
import { AppConfig, AppModule } from '@mod/app';
import { Logger, PinoLogger } from 'nestjs-pino';
import { NestApplication, NestFactory } from '@nestjs/core';
import { clusterize } from '@util/clustering';
import helmet from 'helmet';

const { BASE_PATH, CLUSTERING, PORT, SESSION_SECRET } = process.env;

const bootstrap = async () => {
  const INADDR_ANY = '0.0.0.0';

  const app = await NestFactory.create<NestApplication>(
    AppModule,
    // this logger instance only for logging the app init message (e.g. InstanceLoader),
    // since before booting the app, LoggerModule is not loaded yet
    { logger: new Logger(new PinoLogger(AppConfig.getLoggerConfig()), {}) },
  );

  app.enableVersioning();

  // properly set headers using helmet
  app.use(helmet());

  app.use(
    session({
      secret: SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // Enable CORS by default because Swagger UI required
  app.enableCors();

  app.setGlobalPrefix(BASE_PATH);

  app.listen(PORT, INADDR_ANY);
};
if (CLUSTERING === 'true') clusterize(bootstrap);
else bootstrap();
