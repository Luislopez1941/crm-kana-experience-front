import { Roles } from './Roles';

export interface UserInfo {
  id: number; 
  sucursal_id: number;
  nombre: string;
  email: string;
  password: string;
  tipo_us: number;
  rol: Roles;
}
