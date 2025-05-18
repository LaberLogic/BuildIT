import express, { Express, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const app: Express = express();
const port = 3000;

app.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({});
  res.send(users);
});

app.get("/2", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
