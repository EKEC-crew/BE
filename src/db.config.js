import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/client.js";

export const prisma = new PrismaClient();
dotenv.config();
