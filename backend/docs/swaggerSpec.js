const swaggerJsdoc = require("swagger-jsdoc");

module.exports = swaggerJsdoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Coding Rangers API",
      version: "1.0.0",
      description: "OTP authentication, courses, bookings and administration.",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas: {
        OtpRequest: {
          type: "object",
          required: ["email"],
          properties: {
            name: { type: "string", example: "Alex" },
            email: {
              type: "string",
              format: "email",
              example: "learner@example.com",
            },
          },
        },
        OtpVerify: {
          type: "object",
          required: ["email", "code"],
          properties: {
            email: { type: "string", format: "email" },
            code: { type: "string", example: "123456" },
            purpose: { type: "string", enum: ["register", "login", "admin"] },
          },
        },
        Course: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            instructor: { type: "string" },
            duration: { type: "string" },
            fee: { type: "number" },
            capacity: { type: "integer" },
            imageUrl: { type: "string" },
            status: {
              type: "string",
              enum: ["draft", "published", "archived"],
            },
          },
        },
      },
    },
    paths: {
      "/api/health": {
        get: {
          tags: ["Health"],
          summary: "API health",
          responses: { 200: { description: "API is running" } },
        },
      },
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Send registration OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OtpRequest" },
              },
            },
          },
          responses: { 202: { description: "OTP sent" } },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Send login OTP",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email"],
                  properties: { email: { type: "string", format: "email" } },
                },
              },
            },
          },
          responses: { 202: { description: "OTP sent" } },
        },
      },
      "/api/auth/verify-otp": {
        post: {
          tags: ["Auth"],
          summary: "Verify OTP and receive JWT",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OtpVerify" },
              },
            },
          },
          responses: {
            200: { description: "JWT and user returned" },
            400: { description: "Invalid OTP" },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Current user profile",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "User profile" } },
        },
      },
      "/api/courses": {
        get: {
          tags: ["Courses"],
          summary: "List published courses",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Course list" } },
        },
      },
      "/api/courses/{id}": {
        get: {
          tags: ["Courses"],
          summary: "Get published course",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Course" },
            404: { description: "Not found" },
          },
        },
      },
      "/api/bookings": {
        post: {
          tags: ["Bookings"],
          summary: "Request course booking",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["courseId"],
                  properties: { courseId: { type: "string" } },
                },
              },
            },
          },
          responses: { 201: { description: "Pending booking created" } },
        },
      },
      "/api/bookings/mine": {
        get: {
          tags: ["Bookings"],
          summary: "List own bookings",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Booking list" } },
        },
      },
      "/api/bookings/{id}": {
        delete: {
          tags: ["Bookings"],
          summary: "Cancel pending booking",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Cancelled" } },
        },
      },
      "/api/admin/courses": {
        get: {
          tags: ["Admin"],
          summary: "List all courses",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Courses" } },
        },
        post: {
          tags: ["Admin"],
          summary: "Create course",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          responses: { 201: { description: "Created" } },
        },
      },
      "/api/admin/courses/{id}": {
        patch: {
          tags: ["Admin"],
          summary: "Update course",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Course" },
              },
            },
          },
          responses: { 200: { description: "Updated" } },
        },
        delete: {
          tags: ["Admin"],
          summary: "Delete course and bookings",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: { 200: { description: "Deleted" } },
        },
      },
      "/api/admin/bookings": {
        get: {
          tags: ["Admin"],
          summary: "List all bookings",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Bookings" } },
        },
      },
      "/api/admin/bookings/{id}": {
        patch: {
          tags: ["Admin"],
          summary: "Approve or reject booking",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["status"],
                  properties: {
                    status: { type: "string", enum: ["approved", "rejected"] },
                    note: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Booking reviewed" } },
        },
      },
    },
  },
  apis: [],
});
