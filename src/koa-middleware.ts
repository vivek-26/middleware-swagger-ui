'use strict';

/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * MIT Licensed
 */

/**
 * Module Dependencies
 */

import serveStatic from 'serve-static';
import send from 'koa-send';
import { normalize } from 'path';
const debug = require('debug')('middleware-swagger-ui:koa-middleware');

import { Core } from './core';

/**
 * Swagger UI middleware for Koa v2
 * @class KoaMiddleware
 * @extends {Core}
 */
class KoaMiddleware extends Core {
    private options: any;

    /**
     * Creates an instance of KoaMiddleware.
     * @param {*} options 
     * @memberof KoaMiddleware
     */
    constructor(options: any) {
        super(options);
        this.options = options;
    }

    /**
     * Get swagger path (to serve) & index file name
     * @async
     * @returns {Promise<Object>} data - Object with swagger dist path & index file name
     * @memberof KoaMiddleware
     */
    async getSwaggerPathAndIndex(reqParams: any) {
        if (reqParams['0'] !== '') {
            debug('index file not requested, do not build template!');
            return this.getPublicDirPath();
        }

        debug('index file requested, build the template!');
        const data = await this.buildTemplate();
        return data;
    }
}

/**
 * Middleware function for Koa v2
 * @export
 * @param {Object} options
 * @returns {Function} Koa Static File Serving Middleware
 */
export function koaSwaggerUI(options: any): any {
    /* return the middleware function */
    /* istanbul ignore next */
    return async (ctx: any) => {
        if (ctx.method !== 'GET' && ctx.method !== 'HEAD') return;
        if (typeof ctx.body !== 'undefined' || ctx.status !== 404) return;

        options.routePrefix = normalize(`${ctx.url}//`);

        debug('ctx.params', ctx.params);
        const koaMiddleware = new KoaMiddleware(options);
        const swaggerObj = await koaMiddleware.getSwaggerPathAndIndex(
            ctx.params
        );

        const file =
            typeof ctx.params === 'object'
                ? ctx.params['0'] || `/${swaggerObj.indexFile}`
                : ctx.request.path;
        debug('file', file);

        let normalizedFile = normalize(file);
        debug('normalizedFile', normalizedFile);

        if (normalizedFile.length === 0 || normalizedFile === '/') {
            normalizedFile = swaggerObj.indexFile;
            debug('normalizedFile', normalizedFile);
        }

        await send(ctx, normalizedFile, {
            root: swaggerObj.swaggerDistPath
        });
    };
}

/* unhandledRejection */
process.on('unhandledRejection', error => {
    debug('Unhandled Rejection', error.message);
    console.error('unhandled rejection:', error);
});
