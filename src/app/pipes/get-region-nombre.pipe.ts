import { Pipe, PipeTransform } from '@angular/core';
import { Region } from '../models/geodata.model';

@Pipe({ name: 'getRegionNombre', standalone: true })
export class GetRegionNombrePipe implements PipeTransform {
  transform(regiones: Region[], id: string): string {
    return regiones.find(r => r.id === id)?.nombre || '—';
  }
}