import { OpenAPIV3 } from 'openapi3-ts';

export const openApiSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'DoctorDirect API',
    description: 'Comprehensive medical consultation platform API',
    version: '1.0.0',
    contact: {
      name: 'DoctorDirect Support',
      email: 'support@doctordirect.com',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'https://doctordirect.vercel.app/api',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/ai-diagnosis': {
      post: {
        summary: 'AI Symptom Analysis',
        description: 'Analyze symptoms using AI and provide medical insights',
        tags: ['AI Diagnosis'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['symptoms', 'age', 'gender'],
                properties: {
                  symptoms: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of symptoms',
                  },
                  age: {
                    type: 'number',
                    minimum: 0,
                    maximum: 150,
                    description: 'Patient age',
                  },
                  gender: {
                    type: 'string',
                    enum: ['MALE', 'FEMALE', 'OTHER'],
                    description: 'Patient gender',
                  },
                  severity: {
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH'],
                    description: 'Symptom severity',
                  },
                  duration: {
                    type: 'string',
                    description: 'Duration of symptoms',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'AI diagnosis result',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    diagnosis: { type: 'string' },
                    recommendations: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                    urgency: {
                      type: 'string',
                      enum: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'],
                    },
                    confidence: {
                      type: 'number',
                      minimum: 0,
                      maximum: 1,
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
          },
          '500': {
            description: 'Server error',
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/appointments': {
      get: {
        summary: 'Get appointments',
        description: 'Retrieve user appointments',
        tags: ['Appointments'],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
            },
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'number', minimum: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'number', minimum: 1, maximum: 100 },
          },
        ],
        responses: {
          '200': {
            description: 'List of appointments',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    appointments: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Appointment' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create appointment',
        description: 'Book a new appointment with a doctor',
        tags: ['Appointments'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['doctorId', 'dateTime', 'type'],
                properties: {
                  doctorId: { type: 'string' },
                  dateTime: { type: 'string', format: 'date-time' },
                  type: {
                    type: 'string',
                    enum: ['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY'],
                  },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Appointment created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Appointment' },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/doctors/search': {
      get: {
        summary: 'Search doctors',
        description: 'Search for doctors by specialty, location, etc.',
        tags: ['Doctors'],
        parameters: [
          {
            name: 'specialty',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'location',
            in: 'query',
            schema: { type: 'string' },
          },
          {
            name: 'available',
            in: 'query',
            schema: { type: 'boolean' },
          },
        ],
        responses: {
          '200': {
            description: 'List of doctors',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Doctor' },
                },
              },
            },
          },
        },
      },
    },
    '/health-records': {
      get: {
        summary: 'Get health records',
        description: 'Retrieve patient health records',
        tags: ['Health Records'],
        responses: {
          '200': {
            description: 'Health records',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/HealthRecord' },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create health record',
        description: 'Add new health record entry',
        tags: ['Health Records'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateHealthRecord' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Health record created',
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
  },
  components: {
    schemas: {
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          patientId: { type: 'string' },
          doctorId: { type: 'string' },
          dateTime: { type: 'string', format: 'date-time' },
          status: {
            type: 'string',
            enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
          },
          type: {
            type: 'string',
            enum: ['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY'],
          },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Doctor: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          specialty: { type: 'string' },
          licenseNumber: { type: 'string' },
          experience: { type: 'number' },
          rating: { type: 'number' },
          available: { type: 'boolean' },
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              image: { type: 'string' },
            },
          },
        },
      },
      HealthRecord: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          patientId: { type: 'string' },
          type: {
            type: 'string',
            enum: ['DIAGNOSIS', 'PRESCRIPTION', 'LAB_RESULT', 'VITAL_SIGNS'],
          },
          data: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateHealthRecord: {
        type: 'object',
        required: ['type', 'data'],
        properties: {
          type: {
            type: 'string',
            enum: ['DIAGNOSIS', 'PRESCRIPTION', 'LAB_RESULT', 'VITAL_SIGNS'],
          },
          data: { type: 'object' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          statusCode: { type: 'number' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  tags: [
    {
      name: 'AI Diagnosis',
      description: 'AI-powered medical diagnosis and symptom analysis',
    },
    {
      name: 'Appointments',
      description: 'Appointment booking and management',
    },
    {
      name: 'Doctors',
      description: 'Doctor search and information',
    },
    {
      name: 'Health Records',
      description: 'Patient health records management',
    },
  ],
};