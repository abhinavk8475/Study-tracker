import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function createViteMiddleware() {
  const vite = await createServer({
    root: join(__dirname, ".."),
    server: {
      middlewareMode: true,
    },
  });

  return vite.middlewares;
}
