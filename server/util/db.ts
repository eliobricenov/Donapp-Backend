// Loading and initializing pg-promise:
import pgPromise = require('pg-promise');
import { IMain, IDatabase } from 'pg-promise';
import { IExtensions } from '../repository';

// Database connection parameters:
const config = {
    host: 'localhost',
    port: 5432,
    database: 'tesis',
    user: 'postgres',
    password: '1234',
    query: function (e: any) {
        console.log('QUERY:', e.query);
        if (e.params) {
            console.log('PARAMS:', e.params);
        }
    }
};


const pgp: IMain = pgPromise();

const db = <IDatabase<IExtensions> & IExtensions>pgp(config);

export = db;

