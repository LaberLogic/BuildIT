import app from "./index";
import { env } from "@env";

const start = async () => {
  try {
    const address = await app.listen({ port: env.PORT });
    console.log(`Server listening at ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
