'use strict';

/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * MIT Licensed
 */

/**
 * Module Dependencies
 */

import serveStatic from 'serve-static';
const debug = require('debug')('middleware-swagger-ui:express-middleware');

import { Core } from './core';

/**
 * Swagger UI middleware for Express JS
 * @class ExpressMiddleware
 * @extends {Core}
 */
class ExpressMiddleware extends Core {
    private options: any;

    /**
     * Creates an instance of ExpressMiddleware.
     * @param {Object} options
     * @memberof ExpressMiddleware
     */
    constructor(options: any) {
        super(options);
        this.options = options;
    }

    /**
     * Get swagger path (to serve) & index file name
     * @async
     * @returns {Promise<Object>} data - Object with swagger dist path & index file name
     * @memberof ExpressMiddleware
     */
    async getSwaggerPathAndIndex(reqParams: string) {
        if (reqParams.slice(-1) !== '/') {
            debug('index file not requested, do not build template!');
            return this.getPublicDirPath();
        }

        debug('index file requested, build the template!');
        const data = await this.buildTemplate();
        return data;
    }
}

/**
 * Middleware function for Express JS
 * @param {Object} options
 * @returns {Function} serveStatic - Express Static Middleware
 */
export function expressSwaggerUI(options: any): any {
    /* Return the middleware function */
    return (req: any, res: any, next: any) => {
        debug('req.originalUrl', req.originalUrl);
        options.routePrefix = req.originalUrl;
        const expressMiddleware = new ExpressMiddleware(options);
        expressMiddleware
            .getSwaggerPathAndIndex(req.originalUrl)
            .then(swaggerObj => {
                debug('serve static params', swaggerObj);

                /**
             * Call the serve static function with root dir & index,
             * and then call the function returned by serve static
             * with (req, res, next);
             */
                serveStatic(swaggerObj.swaggerDistPath, {
                    index: swaggerObj.indexFile
                })(req, res, next);
            })
            .catch(err => {
                throw new Error(err.message);
            });
    };
}

/* unhandledRejection */
process.on('unhandledRejection', error => {
    debug('Unhandled Rejection', error.message);
    console.error('unhandled rejection:', error);
});
