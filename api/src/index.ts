import express, { Express, Response, Request } from "express";
import { env } from "../env";
import { secureRouteWithSchema } from "@utils/secureRoute";
import { registerSchema } from "./schemas/authSchema";
import {
  registerController,
  signInController,
} from "./user/controllers/auth.controller";

// ✅ Import user routes
import userRoutes from "./user/routes";

const app: Express = express();
const port = env.PORT;

app.use(express.json());

app.use("/users", userRoutes);

app.post(
  "/auth/register",
  secureRouteWithSchema({ body: registerSchema }),
  registerController,
);

app.post("/auth/signin", signInController);

export const moderatorBoard = (req: Request, res: Response) => {
  res.status(200).send("Moderator Content.");
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
