const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const { koaSwaggerUI } = require('middleware-swagger-ui');
const PORT = 3000;

/* middleware-swagger-ui options */
const options = {
	title: 'Swagger UI',
	oauthOptions: false,
	swaggerOptions: {
		dom_id: '#swagger-ui',
        url: 'http://petstore.swagger.io/v2/swagger.json',
		layout: 'StandaloneLayout',
		deepLinking: true,
	},
	hideTopbar: false,
};

router.get('/docs*', koaSwaggerUI(options));
app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
	console.log(`Server started on port: ${PORT}`);
	console.log(`Swagger Docs - http://localhost:${PORT}/docs`);
});
