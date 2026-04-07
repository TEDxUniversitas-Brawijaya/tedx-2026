export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string; // "admin" | "superadmin"
  createdAt: Date;
  updatedAt: Date;
};
