
const uuidv1 = require('uuid/v1');

export class Servers {
    public static instances: any = {};
    public static classes: any;
    public static addServer(server) {
        let id = uuidv1();
        this.instances[id] = server;
        return id;
    }
    public static set(instanceId, serverType, instance) {
        this.instances[instanceId][serverType] = instance;
        return instance;
    }
    public static get(instanceId, serverType?) {
        if (serverType)
            return this.instances[instanceId][serverType];
        else
            return this.instances[instanceId];
    }

    public static async  send(server, functionArgs, methodulus, paramsMap) {

       let result= await this.instances[methodulus.instanceId][server]._send(functionArgs, methodulus, paramsMap);
       return result;
    }
}