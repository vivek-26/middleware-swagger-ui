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
     * @returns {Object} data - Object with swagger dist path & index file name
     * @memberof ExpressMiddleware
     */
    getSwaggerPathAndIndex() {
        const data = this.buildTemplate();
        return data;
    }
}

/**
 * Middleware function for Express JS
 * @param {Object} options
 * @returns {Function} serveStatic - Express Static Middleware
 */
export function expressSwaggerUI(options: any): any {
    const expressMiddleware = new ExpressMiddleware(options);
    const swaggerObj = expressMiddleware.getSwaggerPathAndIndex();
    debug('serve static params', swaggerObj);
    return serveStatic(swaggerObj.swaggerDistPath, {
        index: swaggerObj.indexFile
    });
}
