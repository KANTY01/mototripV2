import swaggerJSDoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motorcycle Trip Platform API',
      version: '1.0.0',
      description: 'API documentation for the Motorcycle Trip Platform'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            username: {
              type: 'string'
            },
            avatar: {
              type: 'string'
            },
            role: {
              type: 'string'
            },
            experience_level: {
              type: 'string'
            },
            preferred_routes: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            motorcycle_details: {
              type: 'object',
              properties: {
                make: {
                  type: 'string'
                },
                model: {
                  type: 'string'
                },
                year: {
                  type: 'integer'
                }
              }
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Trip: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            start_date: {
              type: 'string',
              format: 'date'
            },
            end_date: {
              type: 'string',
              format: 'date'
            },
            difficulty: {
              type: 'string'
            },
            distance: {
              type: 'number',
              format: 'float'
            },
            created_by: {
              type: 'integer'
            },
            is_premium: {
              type: 'boolean'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            author: {
              type: 'string'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            trip_id: {
              type: 'integer'
            },
            user_id: {
              type: 'integer'
            },
            rating: {
              type: 'number',
              format: 'float'
            },
            content: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            user: {
              type: 'object',
              properties: {
                username: {
                  type: 'string'
                },
                avatar: {
                  type: 'string'
                }
              }
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            user_id: {
              type: 'integer'
            },
            start_date: {
              type: 'string',
              format: 'date'
            },
            end_date: {
              type: 'string',
              format: 'date'
            },
            status: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
