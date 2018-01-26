'use strict';

/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * MIT Licensed
 */

import express from 'express';
import request from 'supertest';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

import { expressSwaggerUI } from '../src/middleware-swagger-ui';

/* express middleware tests */
describe('Express Middleware', () => {
    /* Setup express application */
    const app = express();
    let server = null;

    const options = {
        title: 'Swagger UI',
        oauthOptions: false,
        swaggerOptions: {
            dom_id: '#swagger-ui',
            url: 'http://petstore.swagger.io/v2/swagger.json',
            layout: 'StandaloneLayout',
            deepLinking: true
        },
        routePrefix: '/docs/',
        hideTopbar: false
    };

    /* Swagger EJS template file path */
    const templateFile = join(__dirname, '../src/public/template.html');

    beforeAll(() => {
        /* register swagger ui middleware */
        app.use(options.routePrefix, expressSwaggerUI(options));

        server = app.listen(3000);
    });

    afterAll(() => {
        /* delete the swagger template file */
        unlinkSync(templateFile);

        /* close the server */
        server.close();
    });

    test('expressSwaggerUI should be a function', () => {
        expect(typeof expressSwaggerUI).toBe('function');
    });

    test('swagger ui route should return 200', async () => {
        const res = await request(app).get(options.routePrefix);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toContain('text/html');
    });
});
