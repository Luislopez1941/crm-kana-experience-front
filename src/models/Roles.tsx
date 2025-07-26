export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
