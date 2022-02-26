import express from 'express';
import { Request, Response } from 'express';
import { Application } from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config/config';
import user from './routes/user';
import movie from './routes/movie';
import actor from './routes/actor';
import { createConnection, getConnection } from 'typeorm';
import { Session } from './entity/Session';
import { TypeormStore } from 'typeorm-store';

// Connect to Database
createConnection().then(() => {
  const app: Application = express();
  // Register view engine
  app.set('view engine', 'ejs');

  // Middlewares
  app.use(express.json());
  app.use(cookieParser());

  // Create Session
  const repository = getConnection().getRepository(Session);
  app.use(
    session({
      secret: config.session,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60,
      },
      store: new TypeormStore({ repository }),
    })
  );

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  // Routes
  // app.use('/', (req: Request, res: Response) => {
  //   res.send('Hello World!');
  // });
  app.use('/', user);
  app.use('/movie', movie);
  app.use('/actor', actor);

  //Handle Error
  app.use((req: Request, res: Response) => {
    res.status(500).render('500');
  });

  // Listen to Port
  app.listen(process.env.PORT || 3000, () =>
    console.log('Server is running..')
  );
});
