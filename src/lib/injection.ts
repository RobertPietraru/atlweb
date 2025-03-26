import { AuthService } from "./services/auth_service";
import { db } from "./server/db";
import { env } from "$env/dynamic/private";
export const authService = new AuthService(db);

