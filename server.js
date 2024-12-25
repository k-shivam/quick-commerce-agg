const express = require("express");
const { PORT } = require("./config");
const bodyParser = require("body-parser");
const cluster = require("cluster");
const cors = require("cors");
const os = require("os");
const { routeTracing } = require("./src/middlewares/feature-middlewares");

const routes = require("./src/routes/routes");

// Determine the number of CPUs
const numCPUs = os.cpus().length;

// Cluster setup
if (cluster.isMaster) {
  console.log(`Master process is running with PID ${process.pid}`);
  console.log(`Forking ${numCPUs} workers...`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker exit and respawn
  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Worker ${worker.process.pid} died. Code: ${code}, Signal: ${signal}`
    );
    console.log("Starting a new worker...");
    cluster.fork();
  });
} else {
  // Worker processes
  const app = express();

  // Middleware
  app.use(cors("*"));
  app.use(bodyParser.json());
  app.use(routeTracing);
  app.use("/api/v1/quick", routes);

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running at http://localhost:${PORT}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log(`Worker ${process.pid} is shutting down...`);
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log(`Worker ${process.pid} received SIGINT. Exiting...`);
    process.exit(0);
  });
}

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", promise, "Reason:", reason);
});
