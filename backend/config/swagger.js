import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Management System API',
      version: '1.0.0',
      description: 'API for Om Satsang Parivar Finance Management System',
    },
    servers: [{ url: '/api' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
})
