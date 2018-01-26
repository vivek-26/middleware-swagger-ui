'use strict';

/** 
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * MIT Licensed
 */

/**
 * Module Dependencies
 */

import { readFileSync, writeFileSync } from 'fs';
import { render } from 'ejs';
import { resolve } from 'path';
import defaultsDeep from 'lodash.defaultsdeep';
const debug = require('debug')('middleware-swagger-ui:Core');

/**
 * Core class to build swagger template from options
 * @export @module Core
 * @class Core
 */
export class Core {
    /**
     * default options for Swagger UI middleware
     * @private
     * @type {Object}
     * @memberof Core
     */
    private defaultOptions: any = {
        title: 'Swagger UI',
        oauthOptions: false,
        swaggerOptions: {
            dom_id: '#swagger-ui',
            url: 'http://petstore.swagger.io/v2/swagger.json',
            layout: 'StandaloneLayout',
            deepLinking: true
        },
        hideTopbar: false
    };

    /**
     * config passed by user
     * @private
     * @type {Object}
     * @memberof Core
     */
    private config: any;

    /**
     * Creates an instance of Core.
     * @param {Object} config
     * @memberof Core
     */
    constructor(config: any) {
        this.config = config;
    }

    /**
     * Utility function to build swagger template
     * @protected
     * @returns @property {Object} swaggerDistPath - The path to folder where swagger files are present.
     * @returns @property {Object} indexFile - The filename to be served.
     * @memberof Core
     */
    protected buildTemplate() {
        const swaggerTemplate = readFileSync(
            resolve(__dirname, 'template.ejs'),
            'utf8'
        );
        const config: any = defaultsDeep(this.config, this.defaultOptions);
        debug('config', config);

        const renderedTemplate = render(swaggerTemplate, {
            title: config.title,
            route: config.routePrefix,
            options: config
        });

        const swaggerDistPath: string = resolve(__dirname, 'public');
        debug('Swagger Dist Folder', swaggerDistPath);
        const indexFile: string = 'template.html';
        writeFileSync(`${swaggerDistPath}/${indexFile}`, renderedTemplate);
        return {
            swaggerDistPath,
            indexFile
        };
    }
}
