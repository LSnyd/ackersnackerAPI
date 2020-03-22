import path from 'path';
import sqlite3 from 'sqlite3';
import { database } from '../config.json';

sqlite3.verbose();
const db = new sqlite3.Database(
    path.resolve(__dirname, database), async error => {
        if (error) {
            return console.error('New database Error', error);
        }
        await db.run('CREATE TABLE IF NOT EXISTS farm ( farmName TEXT PRIMARY KEY, firstName TEXT, secondName TEXT, street TEXT, streetNumber NUMBER, city TEXT, place TEXT, longitude NUMBER, latitude NUMBER )');
        await db.run('CREATE TABLE IF NOT EXISTS task ( farmName TEXT, id TEXT, veggieTitle TEXT, date TEXT, time TEXT, availableSlots TEXT, strain TEXT, transport TEXT, salary TEXT )');
    }
);

export const close = async () => {
    db.close(error => {
        if (error) {
            return console.error(error.message);
        }
    });
};

export const createFarm = async ({  farmName, firstName, secondName, street, streetNumber, city, place, longitude, latitude }) => {
    await db.run('REPLACE INTO farm ( farmName, firstName, secondName, street, streetNumber, city, place, longitude, latitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ farmName, firstName, secondName, street, streetNumber, city, place, longitude, latitude]);
};

export const createTask = async ({ farmName, id, veggieTitle, date, time, availableSlots, strain, transport, salary }) => {
    await db.run('INSERT INTO task ( farmName, id, veggieTitle, date, time, availableSlots, strain, transport, salary ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ farmName, id, veggieTitle, date, time, availableSlots, strain, transport, salary]);
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
            let query = `SELECT * FROM ${table} ORDER BY rowid`;
            if (searchField) {
                query = `SELECT * FROM ${table} WHERE id = '${searchField}' ORDER BY rowid`;
            }
            db.get(query, (err, row) => {
                if (err) {
                    return resolve(null);
                } else {
                    console.log("row", row)
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
                    console.log("2k",rows)
                    return resolve(rows);
                }
            });
        } catch (error) {
            console.log('readAllData', error);
            return reject(null);
        }
    });
};

export const readRows = async (table, column, value) => {
    return new Promise((resolve, reject) => {
        try {
            const query = `SELECT * FROM ${table} WHERE ${column} = ?`;

            db.all(query, [value], (err, rows) => {
                if (err) {
                    return resolve(null);
                } else {
                    return resolve(rows || null);
                }
            });
        } catch (error) {
            console.log('readData', error);
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

