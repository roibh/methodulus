import {
    ServerConfiguration, RouterConfiguration, ClientConfiguration,
    ConfiguredServer, BuiltInServers, BuiltInTransports, PluginConfiguration,
} from '@methodus/server';
import { LocalController } from './controllers/local.controller';
import { RemoteService } from './controllers/remote.service';
@PluginConfiguration('@methodus/describe')
@ServerConfiguration(BuiltInServers.Express, { port: 6695 })
@RouterConfiguration(LocalController, BuiltInServers.Express)
@ClientConfiguration(RemoteService, BuiltInTransports.Http, 'https://jsonplaceholder.typicode.com')
export class Xserver extends ConfiguredServer {
    constructor() {
        super(Xserver);
    }
}

(() => {
    return new Xserver();
})();
