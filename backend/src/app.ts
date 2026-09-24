import express from "express";
import cors from "cors";
import { env } from "./utils/env";
import apiRoutes from "./routes";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, Postman) that send no Origin header.
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
