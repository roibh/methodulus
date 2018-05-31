import 'reflect-metadata';
import { logger } from '../log';

import { MethodType, ServerType } from '../interfaces';


let metadataKey = 'methodus';

/** the MethodConfig decorator registers the controller as a router
 *  @param {string} name - the identifier of the controller in the resolver.
 *  @param {Function[]} middlewares - an array of middlewares to apply to this controller}
 */
export function ClientConfiguration(controller: any, methodType: MethodType, serverType: ServerType, resolver?: any) {
    return function (target: any) {
        var original = target.prototype.constructor;
        original.prototype.options = original.prototype.options   || { servers: [], classes: [], plugins: [] };

        original.prototype.options.classes.push({ controller: controller, methodType: methodType, serverType: serverType, resolver: resolver });

        // the new constructor behaviour
        var f: any = function () {
            let instance = new original(target.prototype.options);
            return instance;
        }
        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;
        // return new constructor (will override original)
        return f;
    }
}
