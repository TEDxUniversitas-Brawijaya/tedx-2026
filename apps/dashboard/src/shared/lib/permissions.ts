export const ROLES = {
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const RESOURCES = {
  STORAGE: "storage",
  ORDER: "order",
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];

/**
 * Centralized permission configuration
 * Maps each resource to the roles that can access it
 */
export const PERMISSIONS: Record<Resource, readonly Role[]> = {
  [RESOURCES.STORAGE]: [ROLES.SUPERADMIN],
  [RESOURCES.ORDER]: [ROLES.ADMIN, ROLES.SUPERADMIN],
} as const;

/**
 * Check if a user role has permission to access a resource
 */
export function canAccess(
  userRole: Role | null | undefined,
  resource: Resource
): boolean {
  if (!userRole) {
    return false;
  }

  return PERMISSIONS[resource].includes(userRole);
}
