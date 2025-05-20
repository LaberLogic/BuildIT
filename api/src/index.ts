import express, { Express, Response, Request } from "express";
import { env } from "../env";
import {
  signInController,
  registerController,
} from "@src/user/controllers/user.controller";
import { verifyToken } from "middlewares/authenticate";
import { secureRouteWithSchema } from "@utils/secureRoute";
import { registerSchema } from "./schemas/authSchema";
const app: Express = express();
const port = env.PORT;
export const moderatorBoard = (req: Request, res: Response) => {
  res.status(200).send("Moderator Content.");
};
app.use(express.json());
app.post(
  "/auth/register",
  secureRouteWithSchema(registerSchema),
  registerController,
);

app.post("/auth/signin", signInController);
app.get("/health", [verifyToken], moderatorBoard);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
