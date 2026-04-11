const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce Store',
    version: '1.0.0',
    description:
      'API documentation for the E-Commerce Store. This API manages users, products, cart items, and orders.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      //url: 'https://cse341-node-final-project-sz16.onrender.com',
      //description: 'Local server'
      description: 'Running on Render'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Authentication routes' },
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
          _id: { type: 'string', example: '66c123abc123abc123abc123' },
          name: { type: 'string', example: 'Rodrigo Alexis' },
          email: { type: 'string', example: 'rodrigo@email.com' },
          googleId: { type: 'string', example: '10987654321' },
          role: { type: 'string', example: 'customer' },
          createdAt: { type: 'string', example: '2026-04-09T12:00:00.000Z' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          //_id: { type: 'string', example: '66c123abc123abc123abc999' },
          name: { type: 'string', example: 'Wireless Mouse' },
          description: { type: 'string', example: 'Ergonomic wireless mouse' },
          price: { type: 'number', example: 29.99 },
          category: { type: 'string', example: 'Electronics' },
          stock: { type: 'integer', example: 100 },
          brand: { type: 'string', example: 'LogiTech' },
          imageUrl: {
            type: 'string',
            example: 'https://example.com/images/mouse.jpg'
          }
          //createdAt: { type: 'string', example: '2026-04-09T12:00:00.000Z' },
          //updatedAt: { type: 'string', example: '2026-04-09T12:00:00.000Z' }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66c123abc123abc123abc777' },
          userId: { type: 'string', example: '66c123abc123abc123abc123' },
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
          totalPrice: { type: 'number', example: 59.98 },
          updatedAt: { type: 'string', example: '2026-04-09T12:00:00.000Z' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          //_id: { type: 'string', example: '66c123abc123abc123abc555' },
          userId: { type: 'string', example: '66c123abc123abc123abc123' },
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
          status: { type: 'string', example: 'pending' },
          shippingAddress: { type: 'string', example: 'San Salvador, El Salvador' },
          paymentMethod: { type: 'string', example: 'credit card' }
          //createdAt: { type: 'string', example: '2026-04-09T12:00:00.000Z' }
        }
      }
    }
  },
  paths: {
    '/': {
      get: {
        summary: 'Root route',
        description: 'API home route',
        responses: {
          200: {
            description: 'API running successfully'
          }
        }
      }
    },

    '/auth/google': {
      get: {
        tags: ['Auth'],
        summary: 'Start Google OAuth login',
        responses: {
          200: {
            description: 'Google OAuth route ready'
          }
        }
      }
    },

    '/auth/google/callback': {
      get: {
        tags: ['Auth'],
        summary: 'Google OAuth callback route',
        responses: {
          200: {
            description: 'OAuth callback route ready'
          }
        }
      }
    },

    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get current user profile',
        responses: {
          200: {
            description: 'User profile returned'
          }
        }
      }
    },

    '/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        responses: {
          200: {
            description: 'List of products'
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Product created'
          }
        }
      }
    },

    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Single product returned'
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Product'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Product updated'
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Product deleted'
          }
        }
      }
    },

    '/cart/{userId}': {
      get: {
        tags: ['Cart'],
        summary: 'Get cart by user ID',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Cart returned'
          }
        }
      }
    },

    '/cart': {
      post: {
        tags: ['Cart'],
        summary: 'Add item to cart',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  productId: { type: 'string' },
                  quantity: { type: 'integer' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Item added to cart'
          }
        }
      }
    },

    '/cart/{userId}/items/{productId}': {
      put: {
        tags: ['Cart'],
        summary: 'Update cart item quantity',
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
          200: {
            description: 'Cart item updated'
          }
        }
      },
      delete: {
        tags: ['Cart'],
        summary: 'Remove item from cart',
        parameters: [
          { name: 'userId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'productId', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Cart item removed'
          }
        }
      }
    },

    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Get all orders',
        responses: {
          200: {
            description: 'List of orders'
          }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Order'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Order created'
          }
        }
      }
    },

    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Single order returned'
          }
        }
      },
      put: {
        tags: ['Orders'],
        summary: 'Update order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Order'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Order updated'
          }
        }
      },
      delete: {
        tags: ['Orders'],
        summary: 'Delete order by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          200: {
            description: 'Order deleted'
          }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
