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
import { resolve, extname } from 'path';
import defaultsDeep from 'lodash.defaultsdeep';
const { resolveRefs } = require('json-refs');
import { safeLoad } from 'js-yaml';
const debug = require('debug')('middleware-swagger-ui:Core');

/**
 * Core class to build swagger template from options
 * @export @module Core
 * @class Core
 */
export class Core {
    /**
     * Static object containing methods to reolve refs in yaml & json spec
     * @private
     * @static
     * @type {*}
     * @memberof Core
     */
    private static resolveRefs: any = {
        yaml: async (specFilePath: string) => {
            const root: any = safeLoad(readFileSync(specFilePath).toString());
            const options: any = {
                filter: ['relative', 'remote'],
                loaderOptions: {
                    processContent: function(res: any, callback: any) {
                        callback(null, safeLoad(res.text));
                    }
                }
            };
            const result: any = await resolveRefs(root, options);
            return result.resolved;
        },
        json: async (specFilePath: string) => {
            const fileContents: any = readFileSync(specFilePath, 'utf8');
            const root: any = JSON.parse(fileContents);
            const options: any = {
                filter: ['relative', 'remote']
            };
            const result: any = await resolveRefs(root, options);
            return result.resolved;
        }
    };

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
     * @async
     * @returns @property {Promise<Object>} swaggerDistPath - The path to folder where swagger files are present.
     * @returns @property {Promise<Object>} indexFile - The filename to be served.
     * @memberof Core
     */
    protected async buildTemplate() {
        debug('reading swagger template file');
        const swaggerTemplate = readFileSync(
            resolve(__dirname, 'template.ejs'),
            'utf8'
        );
        const config: any = defaultsDeep(this.config, this.defaultOptions);
        debug('config', config);

        if (
            typeof ((config || {}).swaggerOptions || {}).specFile === 'string'
        ) {
            debug('specFile found, ignoring url property');

            /* Determine spec file etension */
            const extn: string = extname(config.swaggerOptions.specFile);
            debug('specFile extension', extn);

            /* If extension isn't yaml or json, throw an error! */
            if (!extn.slice(1).match(/^(yaml|json)$/)) {
                debug('invalid swagger specification file');
                throw new Error('invalid swagger specification file');
            }

            /* Swagger specification */
            const swaggerSpec: any = await Core.resolveRefs[extn.slice(1)](
                config.swaggerOptions.specFile
            );

            /* delete specFile and attach it to swaggerOption */
            delete config.swaggerOptions.specFile;
            config.swaggerOptions.spec = swaggerSpec;
            debug('added swagger spec to swagger options');
        }

        const renderedTemplate = render(swaggerTemplate, {
            title: config.title,
            route: config.routePrefix,
            options: config
        });

        const swaggerDistPath: string = resolve(__dirname, 'public');
        debug('Swagger Dist Folder', swaggerDistPath);
        const indexFile: string = 'template.html';
        debug('writing rendered swagger template file');
        writeFileSync(`${swaggerDistPath}/${indexFile}`, renderedTemplate);
        return {
            swaggerDistPath,
            indexFile
        };
    }

    /**
     * Uitlity function to return path of 'public' folder,
     * Used when building the template isn't necessary
     * @protected
     * @returns @property {Object} swaggerDistPath Path to public folder
     * @returns @property {Object} indexFile 
     * @memberof Core
     */
    protected getPublicDirPath() {
        return {
            swaggerDistPath: resolve(__dirname, 'public'),
            indexFile: ''
        };
    }
}
