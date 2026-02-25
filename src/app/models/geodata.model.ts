export interface Pais {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  zoom: number;
  bounds: [[number, number], [number, number]];
  moneda: string;
  simbolo_moneda: string;
  codigo_moneda: string;
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
  poblacion?: number | null;
}

export interface GeoData {
  PAISES: Pais[];
  REGIONES: Region[];
  CIUDADES: Ciudad[];
}