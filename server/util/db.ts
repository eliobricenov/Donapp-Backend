// Loading and initializing pg-promise:
import pgPromise = require('pg-promise');
import { IMain, IDatabase } from 'pg-promise';
import { IExtensions } from '../repository';

// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'pg-promise-demo',
    user: 'postgres'
};


const pgp: IMain = pgPromise();

const db = <IDatabase<IExtensions> & IExtensions>pgp(config);

export = db;

