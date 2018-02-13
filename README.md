# Swagger UI as middleware for Koa/Express

[![Build Status](https://travis-ci.org/vivek-26/middleware-swagger-ui.svg?branch=master)](https://travis-ci.org/vivek-26/middleware-swagger-ui)
[![Coverage Status](https://coveralls.io/repos/github/vivek-26/middleware-swagger-ui/badge.svg)](https://coveralls.io/github/vivek-26/middleware-swagger-ui)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

### middleware-swagger-ui

Koa/Express Midleware to serve the Swagger UI bound to your Swagger document. This acts as a living documentation for your APIs hosted from within your app.  
[`swagger-ui`](https://github.com/swagger-api/swagger-ui) version: `3.9.2`

### Usage
**Express** setup:
```js
const express = require('express');
const app = express();
const { expressSwaggerUI } = require('middleware-swagger-ui');
const { join } = require('path');

/* Swagger UI Middleware Options */
const options = {
    title: 'Swagger UI',
    oauthOptions: false,
    swaggerOptions: {
        dom_id: '#swagger-ui',
        specFile: join(__dirname, 'path/to/your/swagger/spec'),
        layout: 'StandaloneLayout',
        deepLinking: true,
    },
    hideTopbar: false,
};

/* Serve Swagger UI */
app.use('/docs', expressSwaggerUI(options));
```
#### Options Object
* **`title: `** Page title
* **`oauthOptions: `** Passed to [`initOAuth()`](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/oauth2.md)
* **`swaggerOptions: `** Passed to [`swaggerUI()`](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md)
* **`swaggerOptions.url: `** Link to swagger specification
* **`swaggerOptions.specFile: `** Read swagger specification from local file (supports both **yaml** and **json**). Works even if `swagger specification is split into multiple files`. Read more [here](http://azimi.me/2015/07/16/split-swagger-into-smaller-files.html). It can resolve `remote` & `local` references (thanks to [whitlockjc](https://github.com/whitlockjc/json-refs)). **`NOTE:`** Using this property overrides **`url`** property.
* **`hideTopbar: `** Hides swagger top bar

**Koa (v2)** setup:
```js
const Koa = require('koa');
const Router = require('koa-router');
const { koaSwaggerUI } = require('middleware-swagger-ui');
const app = new Koa();
const router = new Router();
const { join } = require('path');

const options = {
    title: 'Swagger UI',
    oauthOptions: false,
    swaggerOptions: {
        dom_id: '#swagger-ui',
        url: 'http://petstore.swagger.io/v2/swagger.json',
        specFile: join(__dirname, 'path/to/your/swagger/spec'),
        layout: 'StandaloneLayout',
        deepLinking: true
    },
    hideTopbar: false
};

router.get('/docs*', koaSwaggerUI(options));
app.use(router.routes()).use(router.allowedMethods());
```

### Upcoming
* Add more tests.