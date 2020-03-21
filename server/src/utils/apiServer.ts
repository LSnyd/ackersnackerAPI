// tslint:disable-next-line:no-require-imports
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import packageJson from '../../package.json';
import config from '../config.json';
import { readData, writeData } from './databaseHelper';

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
                const { farm, farmer, email, phone, street, city} = req.body;
                if ( farm && farmer && email && phone && street && city) {
                    await writeData('farm', { farm, farmer, email, phone, street, city });
                }

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
                const { farm, good, spots, date, burden, transport} = req.body;
                if ( farm && good && spots && date && burden && transport) {
                    await writeData('task', {farm, good, spots, date, burden, transport});
                }

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

        app.get('/getFarms', async (req, res) => {
            try {
                let user: any = await readData('farm');
            

                res.json({
                    ...user
                });
            } catch (error) {
                console.log('get user error', error);
                res.send({ error });
            }
        });
        

        app.get('/getTasks', async (req, res) => {
            try {
                let user: any = await readData('task');

                res.json({
                    ...user
                });
            } catch (error) {
                console.log('get user error', error);
                res.send({ error });
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
