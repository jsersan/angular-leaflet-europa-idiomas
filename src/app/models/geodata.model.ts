export interface Pais {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  zoom: number;
  bounds: [[number, number], [number, number]];
}

export interface Region {
  id: string;
  pais: string;
  nombre: string;
  lat?: number;
  lng?: number;
  bounds?: [[number, number], [number, number]];
}

export interface Ciudad {
  id: string;
  region: string;
  nombre: string;
  lat: number;
  lng: number;
  poblacion?: number;  // ← añade esta línea
}

export interface GeoData {
  PAISES: Pais[];
  REGIONES: Region[];
  CIUDADES: Ciudad[];
}