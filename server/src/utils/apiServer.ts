// tslint:disable-next-line:no-require-imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readAllData, writeData, removeData, readRows} from './databaseHelper';
import { IFarm} from '../models/Farmer'
import { ITask } from '../models/Task'
import { IQueryRequest } from '../models/QueryRequest';

/**
 * Class to help with expressjs routing.
 */
export class AppHelper {
    /**
     * Build the application from the routes and the configuration.
     * @param onComplete Callback called when app is successfully built.
     * @param customListener If true uses a custom listener otherwise listens for you during build process.
     * @returns The express js application.
     */
    public static build(onComplete, customListener) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        const app = express();

        app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
            allowedHeaders: 'content-type'
        }));
        app.use(bodyParser.json({ limit: '30mb' }));
        app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
        app.use(bodyParser.json());

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'content-type');
            res.setHeader('Connection', 'keep-alive');
            next();
        });

        //Write in DB 
        app.post('/createFarm', async (req, res) => {
            try {
                const farmData : IFarm = req.body
                await writeData('farm', farmData);

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('data Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/createTask', async (req, res) => {
            try {
                req.body.forEach(async (task: ITask) => {
                    await writeData('task', task);
                })
                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('data Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.post('/query', async (req, res) => {
            try {
                console.log(req.body)
                const request: IQueryRequest = req.body
                let rows: any = await readRows(request.table, request.attribute, request.value);
                console.log("ro2,",rows)
                res.send(
                    rows
                );
    
            } catch (error) {
                console.log('data Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });

        app.get('/getFarms', async (req, res) => {
            try {
                let farms: any = await readAllData('farm');
                console.log("mu",farms)
                res.send(
                    farms
                );
            } catch (error) {
                console.log('get user error', error);
                res.send({ error });
            }
        });


        app.get('/getTasks', async (req, res) => {
            try {
                let tasks: any = await readAllData('task');
                res.send(
                    tasks
                    );
            } catch (error) {
                console.log('get user error', error);
                res.send({ error });
            }
        });

        app.get('/fillDB', async (req, res) => {
            try {
                config.defaultFarmers.forEach(async (farmer: IFarm) => {
                    await writeData('farm', farmer);
                })
                config.defaultTasks.forEach(async (task: ITask)  => {
                    await writeData('task', task);
                })

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('Fill DB Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });


        app.get('/cleanDB', async (req, res) => {
            try {
                await removeData('farm');
                await removeData('task');

                await res.send({
                    success: true
                });
            } catch (error) {
                console.log('Clean DB Error', error);
                res.send({
                    success: false,
                    error
                });
            }
        });





        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
        if (!customListener) {
            app.listen(port, async err => {
                if (err) {
                    throw err;
                }

                console.log(`Started API Server on port ${port} v${packageJson.version}`);

                if (onComplete) {
                    onComplete(app, config, port);
                }
            });
        } else {
            if (onComplete) {
                onComplete(app, config, port);
            }
        }

        return app;
    }
}
