import express from 'express';
import logger from './utils/logger';
import config from './config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {errorHandlingMiddleware} from "./middleware/errorHandling.middleware";
import {corsConfig} from "./config/corsConfig";
import routes from "./routes";
import {sequelize} from './models';
import tokenCleanupService from './services/tokenCleanup.service';

const app = express();

const port = config.port || 3000;
const isDev = config.env === 'development';

app.use(express.json());
app.use(cors(corsConfig(isDev)));
app.use(cookieParser());
app.use('/api', routes);
app.use(errorHandlingMiddleware);

const start = async () => {
	await sequelize.authenticate();
	await sequelize.sync();
	
	// Start token cleanup service (runs every 24 hours)
	tokenCleanupService.start();
	
	app.listen(port, () => {
		logger.info(`Сервер запущен на http://localhost:${port} [${config.env}]`);
	});
}

start()
