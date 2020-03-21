import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS farm ( farm TEXT PRIMARY KEY, farmer TEXT, email TEXT, phone TEXT, street TEXT, city TEXT)');
        await db.run('CREATE TABLE IF NOT EXISTS task (farm TEXT PRIMARY KEY, good TEXT, spots INTEGER, date TEXT, burden TEXT, transport TEXT)');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createFarm = async ({ farm , farmer = '', email = '', phone = '', street = '', city = '' }) => {
    console.log("CREATE FARM")
    await db.run('REPLACE INTO farm (farm, farmer, email, phone, street, city) VALUES (?, ?, ?, ?, ?, ?)', [farm, farmer, email, phone, street, city ]);
};

export const createTask = async ({ farm, good, spots, date, burden, transport }) => {
    await db.run('REPLACE INTO task (farm, good, spots, date, burden, transport ) VALUES (?, ?, ?, ?, ?, ?)', [farm, good, spots, date, burden, transport]);
};

export const writeData = async (table, data) => {
    try {
        console.log('writeData', table, data);
        switch (table) {
            case 'farm':
                await createFarm(data);
                return;
            case 'task':
                await createTask(data);
                return;
        }
    } catch (error) {
        console.log('writeData', error);
        return null;
    }
};

export const readData = async (table, searchField = null) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `SELECT * FROM ${table} ORDER BY rowid DESC LIMIT 1`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE id = '${searchField}' ORDER BY rowid DESC LIMIT 1`;
            }
            db.get(query, (err, row) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(row || null);
                }
            });
        } catch (error) {
            console.log('readData', error);
            return reject(null);
        }
    });
};

export const readAllData = async (table) => {
    return new Promise((resolve, reject) => {
        try {
            db.all(`SELECT * FROM ${table}`, (err, rows) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(rows);
                }
            });
        } catch (error) {
            console.log('readAllData', error);
            return reject(null);
        }
    });
};

export const removeData = (table) => {
    return new Promise(async resolve => {
        await db.run(`DELETE FROM ${table}`);
        resolve();
    });
};

