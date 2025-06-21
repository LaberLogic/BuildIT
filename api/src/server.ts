import { env } from "@env";

import app from "./index";

const start = async () => {
  try {
    const address = await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
