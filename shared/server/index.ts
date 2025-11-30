import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createViteMiddleware } from "./vite";
import { createRoutes } from "./routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(express.json());

const routes = createRoutes();
app.use("/api", routes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "public")));
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
  });
} else {
  const viteMiddleware = await createViteMiddleware();
  app.use(viteMiddleware);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`[express] serving on port ${port}`);
});
