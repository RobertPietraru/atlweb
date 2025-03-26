import { AuthService } from "./services/auth_service";
import { db } from "./server/db";
import { env } from "$env/dynamic/private";
import { AdminService } from "./services/admin_service";
export const authService = new AuthService(db);
export const adminService = new AdminService(db);

