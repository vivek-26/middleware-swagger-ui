'use strict';

/**
 * @author Vivek Kumar <vivek.kumar26@live.com>
 * MIT Licensed
 */

import Koa from 'koa';
import Router from 'koa-router';
import express from 'express';
import request from 'supertest';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

import { koaSwaggerUI, expressSwaggerUI } from '../src/middleware-swagger-ui';

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
        hideTopbar: false
    };
    const apiDoc = '/docs/';

    /* Swagger EJS template file path */
    const templateFile = join(__dirname, '../src/public/template.html');

    beforeAll(() => {
        /* register swagger ui middleware */
        app.use(apiDoc, expressSwaggerUI(options));

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

    test('swagger ui route should return index file (template.html)', async () => {
        const res = await request(app).get(apiDoc);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toContain('text/html');
    });

    test('swagger ui route should return other files in public folder', async () => {
        const res = await request(app).get(`${apiDoc}swagger-ui.css`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toContain('text/css');
    });
});

/* koa middleware tests */
describe('Koa Middleware', () => {
    /* setup koa app */
    const app = new Koa();
    const router = new Router();
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
        hideTopbar: false
    };
    const apiDoc = '/api-docs*';

    /* Swagger EJS template file path */
    const templateFile = join(__dirname, '../src/public/template.html');

    beforeAll(() => {
        /* register swagger ui middleware */
        router.get(apiDoc, koaSwaggerUI(options));
        app.use(router.routes()).use(router.allowedMethods());

        server = app.listen(3001);
    });

    afterAll(() => {
        /* delete the swagger template file */
        unlinkSync(templateFile);

        /* close the server */
        server.close();
    });

    test('koaSwaggerUI should be a function', () => {
        expect(typeof koaSwaggerUI).toBe('function');
    });

    test('swagger ui route should return index file (template.html)', async () => {
        const res = await request(server).get('/api-docs');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toContain('text/html');
    });

    test('swagger ui route should return other files in public folder', async () => {
        const res = await request(server).get('/api-docs/swagger-ui.css');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toContain('text/css');
    });
});
