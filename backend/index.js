require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const seedAdmin = require("./utils/seedAdmin");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swaggerSpec");

const app = express();
// Vercel sits in front of the function and forwards the client IP in X-Forwarded-For.
app.set("trust proxy", 1);
let servicesPromise;

function initializeServices() {
  if (!servicesPromise) {
    servicesPromise = connectDB()
      .then(seedAdmin)
      .catch((error) => {
        servicesPromise = undefined;
        throw error;
      });
  }
  return servicesPromise;
}

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN
      ? process.env.CLIENT_ORIGIN.split(",")
      : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use(
  "/api-docs",
  (req, res, next) => {
    res.removeHeader("Content-Security-Policy");
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));
app.use(async (req, res, next) => {
  if (req.path === "/api/health" || req.path.startsWith("/api-docs"))
    return next();
  try {
    await initializeServices();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

async function start() {
  await initializeServices();
  const port = Number(process.env.PORT || 3000);
  app.listen(port, () =>
    console.log(`Coding Rangers API listening on ${port}`),
  );
}

if (require.main === module)
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = app;
module.exports.start = start;
