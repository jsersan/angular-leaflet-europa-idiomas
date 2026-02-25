import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeodataService } from './core/geodata.service';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MapaComponent } from './components/mapa/mapa.component';
import { Pais, Region, Ciudad, GeoData } from './models/geodata.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, MapaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;

  paises:   Pais[]   = [];
  regiones: Region[] = [];
  ciudades: Ciudad[] = [];

  paisActivo:   Pais   | null = null;
  regionActiva: Region | null = null;
  ciudadActiva: Ciudad | null = null;

  pinCount = 0;

  constructor(private geodataService: GeodataService) {}

  ngOnInit() {
    this.geodataService.getGeoData().subscribe((data: GeoData) => {
      this.paises   = data.PAISES;
      this.regiones = data.REGIONES;
      this.ciudades = data.CIUDADES;
    });
  }

  onPaisChange(pais: Pais | null) {
    this.paisActivo   = pais;
    this.regionActiva = null;
    this.ciudadActiva = null;

    if (pais) {
      const ciudadesPais = this.ciudades.filter(c => {
        const reg = this.regiones.find(r => r.id === c.region);
        return reg?.pais === pais.id;
      });
      this.pinCount = ciudadesPais.length;
    } else {
      this.pinCount = 0;
    }
  }

  onRegionChange(region: Region | null) {
    this.regionActiva = region;
    this.ciudadActiva = null;

    if (region) {
      this.pinCount = this.ciudades.filter(c => c.region === region.id).length;
    }
  }

  onCiudadChange(ciudad: Ciudad | null) {
    this.ciudadActiva = ciudad;
    if (ciudad) this.pinCount = 1;
  }

  onReset() {
    this.paisActivo   = null;
    this.regionActiva = null;
    this.ciudadActiva = null;
    this.pinCount     = 0;
    this.mapaComponent.reset();
  }
}