import { Pipe, PipeTransform } from '@angular/core';
import { Pais } from '../models/geodata.model';

@Pipe({ name: 'getPaisNombre', standalone: true })
export class GetPaisNombrePipe implements PipeTransform {
  transform(paises: Pais[], id: string): string {
    return paises.find(p => p.id === id)?.nombre || '—';
  }
}