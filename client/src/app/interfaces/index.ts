export interface Usuario {
  id: number;
  username: string;
  rol: 'admin' | 'user';
}

export interface Cliente {
  id?: number;
  dni: string;
  nombre: string;
  email?: string;
  puntos_actuales: number;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  disponible: boolean;
}

export interface AuthResponse {
  msg: string;
  token: string;
  usuario: {
    username: string;
    rol: string;
  };
}