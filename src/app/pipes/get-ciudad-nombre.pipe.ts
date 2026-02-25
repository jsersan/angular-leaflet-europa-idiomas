import { Pipe, PipeTransform } from '@angular/core';
import { Ciudad } from '../models/geodata.model';

@Pipe({ name: 'getCiudadNombre', standalone: true })
export class GetCiudadNombrePipe implements PipeTransform {
  transform(ciudades: Ciudad[], id: string): string {
    return ciudades.find(c => c.id === id)?.nombre || '—';
  }
}
