import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import {
  securityHeaders,
  generalRateLimit,
  slowDownMiddleware,
  sessionConfig,
  securityLogger,
  sanitizeInput
} from "./security/owasp-compliance";
import {
  SecureDevelopmentManager
} from "./security/iso27001-compliance";
import { MEMORY_LIMIT_MB, MEMORY_CHECK_INTERVAL_MS, SERVER_PORT, SERVER_HOST } from "../shared/config";

// Memory monitoring and optimization
const monitorMemory = () => {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);

  if (heapUsedMB > MEMORY_LIMIT_MB) {
    console.warn(`Memory usage: ${heapUsedMB}MB (${MEMORY_LIMIT_MB}MB limit)`);
    if (global.gc) global.gc(); // Force garbage collection
  }
};

// Check memory at configured interval
setInterval(monitorMemory, MEMORY_CHECK_INTERVAL_MS);

const app = express();

// Configure trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware configuration
app.use(securityHeaders);
app.use(generalRateLimit);
app.use(slowDownMiddleware);
app.use(securityLogger);
app.use(sanitizeInput);

// Session management
app.use(session(sessionConfig));

// Security headers and development practices
app.use(SecureDevelopmentManager.validateSecureHeaders);
app.use(SecureDevelopmentManager.performInputValidation);

// Lightweight middleware configuration
app.use(express.json({ limit: '1mb' })); // Limit payload size
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on configured port
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = SERVER_PORT;
  server.listen({
    port,
    host: SERVER_HOST,
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
