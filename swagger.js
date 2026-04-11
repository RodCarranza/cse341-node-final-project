const isProduction = process.env.RENDER || process.env.NODE_ENV === 'production';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce Store',
    version: '1.0.0',
    description:
      'API documentation for the E-Commerce Store. This API manages users, products, cart items, and orders.'
  },
  servers: isProduction
    ? [
        {
          url: 'https://cse341-node-final-project-sz16.onrender.com',
          description: 'Render server'
        }
      ]
    : [
        {
          url: 'http://localhost:3000',
          description: 'Local server'
        }
      ],
  tags: [
    // { name: 'Auth', description: 'Authentication routes' },
    { name: 'Users', description: 'User routes' },
    { name: 'Products', description: 'Product routes' },
    { name: 'Cart', description: 'Cart routes' },
    { name: 'Orders', description: 'Order routes' }
  ],
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          googleId: { type: 'string' },
          role: { type: 'string' },
          createdAt: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          stock: { type: 'integer' },
          brand: { type: 'string' },
          imageUrl: { type: 'string' }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer' }
              }
            }
          },
          totalPrice: { type: 'number' },
          updatedAt: { type: 'string' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'integer' }
              }
            }
          },
          totalAmount: { type: 'number' },
          status: { type: 'string' },
          shippingAddress: { type: 'string' },
          paymentMethod: { type: 'string' }
        }
      }
    }
  },
  paths: {
    /* '/auth/google': {
      get: {
        tags: ['Auth'],
        summary: 'Start Google OAuth login',
        responses: {
          302: { description: 'Redirect' }
        }
      }
    },

    '/auth/google/callback': {
      get: {
        tags: ['Auth'],
        summary: 'Google OAuth callback',
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' }
        }
      }
    }, */

    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile',
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' }
        }
      }
    },

    '/users/me': {
      delete: {
        tags: ['Users'],
        summary: 'Delete current user account',
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    },

    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        responses: {
          200: { description: 'OK' },
          500: { description: 'Server error' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Product' }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          500: { description: 'Server error' }
        }
      }
    },

    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          400: { description: 'Bad request' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Wireless Mouse' },
                  description: { type: 'string', example: 'Ergonomic wireless mouse' },
                  price: { type: 'number', example: 29.99 },
                  category: { type: 'string', example: 'Electronics' },
                  stock: { type: 'integer', example: 100 },
                  brand: { type: 'string', example: 'Logitech' },
                  imageUrl: {
                    type: 'string',
                    example: 'https://example.com/images/mouse.jpg'
                  }
                }
              }
            }
          }
        },
        responses: {
          204: { description: 'Updated Products' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    },

    '/cart/{userId}': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart',
        parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    },

    '/cart': {
      post: {
        tags: ['Cart'],
        summary: 'Add to cart',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: 'user123' },
                  productId: { type: 'string', example: '66c123abc123abc123abc999' },
                  quantity: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    },

    '/cart/{userId}/items/{productId}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item',
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  quantity: { type: 'integer', example: 3 }
                }
              }
            }
          }
        },
        responses: {
          204: { description: 'Updated Cart' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove cart item',
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    },

    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: { description: 'OK' },
          401: { description: 'Unauthorized' },
          500: { description: 'Server error' }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Order' }
            }
          }
        },
        responses: {
          201: { description: 'Created' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          500: { description: 'Server error' }
        }
      }
    },

    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      },
      put: {
        tags: ['Orders'],
        summary: 'Update order',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string', example: 'user123' },
                  items: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        productId: {
                          type: 'string',
                          example: '66c123abc123abc123abc999'
                        },
                        quantity: { type: 'integer', example: 2 }
                      }
                    }
                  },
                  totalAmount: { type: 'number', example: 59.98 },
                  status: { type: 'string', example: 'processing' },
                  shippingAddress: {
                    type: 'string',
                    example: 'San Salvador, El Salvador'
                  },
                  paymentMethod: { type: 'string', example: 'credit card' }
                }
              }
            }
          }
        },
        responses: {
          204: { description: 'Updated Orders' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      },
      delete: {
        tags: ['Orders'],
        summary: 'Delete order',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'OK' },
          400: { description: 'Bad request' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
          500: { description: 'Server error' }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
