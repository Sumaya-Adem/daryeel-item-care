import { env } from "./utils/env";
import app from "./app";
import { prisma } from "./services/prisma.service";

const server = app.listen(env.port, () => {
  console.log(`Daryeel API running on http://localhost:${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
