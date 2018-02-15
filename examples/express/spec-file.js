const express = require('express');
const app = express();
const { expressSwaggerUI } = require('middleware-swagger-ui');
const PORT = 3000;

/* middleware-swagger-ui options */
const options = {
	title: 'Swagger UI',
	oauthOptions: false,
	swaggerOptions: {
		dom_id: '#swagger-ui',
		specFile: './swagger-docs/index.json',
		layout: 'StandaloneLayout',
		deepLinking: true,
	},
	hideTopbar: false,
};

/* Register middleware */
app.use('/docs', expressSwaggerUI(options));

app.listen(PORT, () => {
	console.log(`Server started on port: ${PORT}`);
	console.log(`Swagger Docs - http://localhost:${PORT}/docs`);
});
