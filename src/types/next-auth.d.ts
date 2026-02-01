import "next-auth";
import { AdminRole } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: AdminRole;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
