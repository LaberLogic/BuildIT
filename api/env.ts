import * as dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { cleanEnv, port,str } from "envalid";

dotenvExpand.expand(dotenv.config());

const removeEmptyStringValues = (env: NodeJS.ProcessEnv): NodeJS.ProcessEnv =>
  Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(env).filter(([_, value]) => value?.trim() !== ""),
  );

export const env = cleanEnv(removeEmptyStringValues(process.env), {
  NODE_ENV: str({ choices: ["development", "test", "production"] }),
  PORT: port(),
  JWT_SECRET: str(),
  DATABASE_URL: str(),
});
