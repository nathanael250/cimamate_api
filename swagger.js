const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Climamate API',
      version: '1.0.0',
      description: 'A weather-aware planning service API',
      contact: {
        name: 'API Support',
        email: 'support@climamate.com'
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Development server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js', './models/swagger-models.js'] // Include the models file
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
