import { Server } from 'http';
import { AppHelper } from './utils/apiServer';

AppHelper.build(
    (app, config, port) => {

        const server = new Server(app);
        server.listen(port);

    },
    true);
