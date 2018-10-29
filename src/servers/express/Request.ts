
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'reflect-metadata';
import { logger, LogClass } from '../../log';
import * as fs from 'fs';
import * as path from 'path';

const https = require('https');



import * as request from 'request-promise-native';

@LogClass(logger)
export class Request {
    constructor() {
    }


    sendRequest(verb, uri, params, paramsMap, securityContext) {
        const body = {};
        const headers = {};
        const cookies = {};
        const query = {};
        let files: any = [];
        try {
            paramsMap.forEach((item) => {
                item.value = params[item.index];
                switch (item.from) {
                    case 'params':
                        if (item.name) {
                            uri = uri.replace(':' + item.name, item.value);
                        } else {
                            Object.keys(item.value).forEach((element) => {
                                uri = uri.replace(':' + element, item.value[element]);
                            });

                        }
                        break;

                    case 'body':
                        if (item.name) {
                            body[item.name] = item.value;
                        } else {
                            Object.assign(body, item.value);
                        }

                        break;
                    case 'query':
                        if (item.name) {
                            query[item.name] = item.value;
                        } else {
                            Object.assign(query, item.value);
                        }
                        break;
                    case 'att_security_context':
                        securityContext = { uid: item.value.uid, user_id: item.value.user_id }
                        break;
                    case 'headers':
                        headers[item.name] = item.value;

                        break;
                    case 'cookies':
                        cookies[item.name] = item.value;
                        break;
                    case 'files':
                        files = item.value;
                        break;
                }
            });
        } catch (error) {
            logger.error(error);
        }

        if (Object.keys(query).length > 0) {
            uri += '?' + Object.keys(query).map((element: any) => {
                if (Array.isArray(query[element])) {
                    return query[element].map((subelement: any) => {
                        if (typeof subelement !== 'string') {
                            return `${element}=${encodeURIComponent(JSON.stringify(subelement))}`;
                        } else {
                            return `${element}=${encodeURIComponent(subelement)}`;
                        }
                    }).join('&');
                }

                if (query[element] && query[element].toISOString) {// test for date
                    return `${element}=${query[element].toISOString()}`;
                } else if (typeof query[element] !== 'string') {// test for other object types
                    return `${element}=${encodeURIComponent(JSON.stringify(query[element]))}`;
                } else {
                    return `${element}=${encodeURIComponent(query[element])}`;
                }

            }).join('&');
        }

        console.log(uri.split('://')[1].split('/').splice(0, 1).join('/'));
        const parts = uri.split('://')[1].split('/');
        parts.splice(0, 1);
        let requestOptions: any;

        if (uri.indexOf('https://') === 0) {
            const hostParts = uri.split('://')[1].split('/')[0].split(':');
            const agent = new https.Agent({
                host: hostParts[0],
                port: hostParts[1],
                path: parts.join('/').split('?')[0],
                strictSSL: false,
                rejectUnauthorized: false,
            });

            requestOptions = {
                method: verb,
                uri,
                timeout: 1000 * 60 * 5,
                rejectUnauthorized: false,
                strictSSL: false,
                secureProtocol: 'TLSv1_method',
                requestCert: false,// add when working with https sites
                agent,// add when working with https sites
            };

        } else {
            requestOptions = {
                method: verb,
                uri,
                timeout: 1000 * 60 * 5,
            };
        }

        logger.log(this, body, uri);
        if (Object.keys(body).length > 0) {
            requestOptions.body = body;
            requestOptions.json = true;
        }
        if (securityContext) {
            requestOptions.headers = {
                'hub-ess-cookie': JSON.stringify(securityContext),
            };
        }

        if (headers && Object.keys(headers).length > 0) {
            if (!requestOptions.headers) {
                requestOptions.headers = {};
            }
            Object.assign(requestOptions.headers, headers);
        }

        if (cookies && Object.keys(cookies).length > 0) {
            requestOptions.cookies = cookies;
            requestOptions.jar = true; // enable cookies
        }

        if (files && files.length > 0) {
            const file: any = files[0];
            const formData: any = {
                custom_file:
                {
                    value: fs.createReadStream(path.resolve(file.path)),
                    options: {
                        filename: file.originalname,
                        contentType: file.mimetype,
                        size: file.size,
                    },
                },
            };
            requestOptions.formData = formData;

        } else if (files && files.readable) {
            const formData: any = {
                custom_file:
                {
                    value: files,
                    options: {
                        filename: path.basename(files.path),
                    },
                },
            };
            requestOptions.formData = formData;
        }

        // very important it allows the download of binary files
        requestOptions.encoding = null;
        logger.log(this, 'request options are: ', requestOptions);
        try {
            const returnedPipe = this.promiseToTry(requestOptions);
            return returnedPipe;
        } catch (error) {
            throw (error);
        }
    }

    public promiseToTry(requestOptions) {
        requestOptions.retryCount = requestOptions.retryCount || 0;
        try {
            // let result = await
            return this.try(requestOptions);
            // return result;
        } catch (error) {
            throw (error);
            // return reject(error);
        }
    }

    public try(requestOptions) {
        console.log(requestOptions.uri);

        const requestToPipe = request(requestOptions);
        requestToPipe.on('error', (error) => {

            console.error(error);
        });
        return requestToPipe;
    }
}
