// Token utility functions
export interface DecodedToken {
  email: string;
  sub: number;
  role: {
    id: number;
    name: string;
    description: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  };
  iat: number;
  exp: number;
}

export const TokenKey = 'tokenKana';

/**
 * Decode JWT token without external libraries
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TokenKey);
};

/**
 * Set token in localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TokenKey, token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TokenKey);
};

/**
 * Check if user is authenticated and token is valid
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  return !isTokenExpired(token);
};

/**
 * Get user role from token
 */
export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role?.name || null;
};

/**
 * Get user ID from token
 */
export const getUserId = (): number | null => {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.sub || null;
};

/**
 * Check if user has specific permission
 */
export const hasPermission = (permission: string): boolean => {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded?.role?.permissions) return false;
  
  return decoded.role.permissions.includes('*') || decoded.role.permissions.includes(permission);
};
