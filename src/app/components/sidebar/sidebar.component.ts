import {
  Component, Input, Output, EventEmitter,
  OnChanges, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Pais, Region, Ciudad } from '../../models/geodata.model';
import { GetPaisNombrePipe }   from '../../pipes/get-pais-nombre.pipe';
import { GetRegionNombrePipe } from '../../pipes/get-region-nombre.pipe';
import { GetCiudadNombrePipe } from '../../pipes/get-ciudad-nombre.pipe';
import { TranslationService } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, GetPaisNombrePipe, GetRegionNombrePipe, GetCiudadNombrePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnChanges, OnInit, OnDestroy {

  @Input() paises:   Pais[]   = [];
  @Input() regiones: Region[] = [];
  @Input() ciudades: Ciudad[] = [];

  @Output() paisChange:   EventEmitter<Pais | null>   = new EventEmitter();
  @Output() regionChange: EventEmitter<Region | null> = new EventEmitter();
  @Output() ciudadChange: EventEmitter<Ciudad | null> = new EventEmitter();
  @Output() reset:        EventEmitter<void>          = new EventEmitter();

  paisId:   string = '';
  regionId: string = '';
  ciudadId: string = '';

  paisesOrdenados:   Pais[]   = [];
  regionesFiltradas: Region[] = [];
  ciudadesFiltradas: Ciudad[] = [];

  private sub!: Subscription;

  constructor(public i18n: TranslationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Re-render when language changes
    this.sub = this.i18n.lang$.subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paises']) {
      this.paisesOrdenados = [...this.paises]
        .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }
  }

  onPaisChange() {
    const pais = this.paises.find(p => p.id === this.paisId) || null;

    this.regionId = '';
    this.ciudadId = '';
    this.regionesFiltradas = pais
      ? [...this.regiones.filter(r => r.pais === this.paisId)]
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      : [];
    this.ciudadesFiltradas = [];

    this.paisChange.emit(pais);
    this.regionChange.emit(null);
    this.ciudadChange.emit(null);
  }

  onRegionChange() {
    const region = this.regiones.find(r => r.id === this.regionId) || null;

    this.ciudadId = '';
    this.ciudadesFiltradas = region
      ? [...this.ciudades.filter(c => c.region === this.regionId)]
          .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
      : [];

    this.regionChange.emit(region);
    this.ciudadChange.emit(null);
  }

  onCiudadChange() {
    const ciudad = this.ciudades.find(c => c.id === this.ciudadId) || null;
    this.ciudadChange.emit(ciudad);
  }

  resetAll() {
    this.paisId   = '';
    this.regionId = '';
    this.ciudadId = '';
    this.regionesFiltradas = [];
    this.ciudadesFiltradas = [];
    this.reset.emit();
  }
}