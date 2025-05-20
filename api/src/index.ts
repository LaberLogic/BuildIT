import express, { Express } from "express";
import { env } from "../env";
import {
  signInController,
  registerController,
} from "@src/user/controllers/user.controller";
const app: Express = express();
const port = env.PORT;
app.use(express.json());
app.post("/auth/register", registerController);
app.post("/auth/signin", signInController);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
