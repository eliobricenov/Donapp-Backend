// Loading and initializing pg-promise:
import pgPromise from 'pg-promise';
import { IMain, IDatabase } from 'pg-promise';
import { IExtensions } from '../repository';
import monitor from 'pg-monitor';

// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'tesis',
    user: 'postgres',
    password: '1234'
};

monitor.attach(config);

const pgp: IMain = pgPromise();

const db = <IDatabase<IExtensions> & IExtensions>pgp(config);

export = db;

