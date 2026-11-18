import http from "node:http";

import { createExpressApp } from "./app/index.js";
import { env } from "./env.js";

(async function main() {
    const app = createExpressApp();
    const server = http.createServer(app);

    server.listen(env.PORT, () => {
        console.log(`Server started at http://localhost:${env.PORT} at ${env.NODE_ENV}`);
    })
})()
.catch((error) => {
    console.error(error);
    process.exit(1);
})