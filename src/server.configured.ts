
import { MethodusConfig } from './config';
import { LogClass, logger } from './log/';
import { Server } from './server';

@LogClass(logger)
export class ConfiguredServer {
    server: Server;
    constructor(target?: any) {
        const options = target.prototype.options;

        const server = new Server();
        this.server = server;
        server.config = new MethodusConfig();

        options.servers.forEach((element: any) => {
            if (server.config) {
                server.config.run(element.serverType, element.options);
            }
        });
        options.classes.forEach((element: any) => {
            if (server.config) {
                server.config.use(element.controller, element.methodType, element.serverType);
            }
        });

        options.clients.forEach((element: any) => {
            if (server.config) {
                server.config.useClient(element.controller, element.transportType, element.resolver);
            }
        });

        if (options.plugins) {
            server.plugins(options.plugins);
        }
        (async () => {
            await server.start();
        })();
    }

    public kill() {
        this.server.kill();
    }

}
