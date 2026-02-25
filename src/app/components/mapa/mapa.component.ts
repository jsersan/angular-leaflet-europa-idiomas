import {
  Component, Input, OnChanges, SimpleChanges,
  AfterViewInit, OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import * as L from 'leaflet';
import { Ciudad, Region, Pais } from '../../models/geodata.model';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('mapEl', { static: true }) mapEl!: ElementRef;

  @Input() paises:      Pais[]        = [];
  @Input() regiones:    Region[]      = [];
  @Input() ciudades:    Ciudad[]      = [];
  @Input() paisActivo:  Pais | null   = null;
  @Input() regionActiva: Region | null = null;
  @Input() ciudadActiva: Ciudad | null = null;

  private map!: L.Map;
  private markersLayer = L.layerGroup();

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;

    if (changes['ciudadActiva'] && this.ciudadActiva) {
      this.pintarCiudadSeleccionada();
      return;
    }
    if (changes['regionActiva'] && this.regionActiva) {
      this.pintarRegion();
      return;
    }
    if (changes['paisActivo'] && this.paisActivo) {
      this.pintarPais();
      return;
    }
    if (changes['paisActivo'] && !this.paisActivo) {
      this.reset();
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  // ── Inicialización ──────────────────────────────────────────
  private initMap() {
    this.map = L.map(this.mapEl.nativeElement, {
      center: [50.5, 10.0],
      zoom: 4,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  // ── Helpers ─────────────────────────────────────────────────
  private makeIcon(color: string, size = 10): L.DivIcon {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 32" width="${size * 2.2}" height="${size * 3}">
      <filter id="s">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity=".3"/>
      </filter>
      <g filter="url(#s)">
        <path d="M12 0C6.48 0 2 4.48 2 10c0 7.5 10 20 10 20S22 17.5 22 10
                 C22 4.48 17.52 0 12 0z" fill="${color}"/>
        <circle cx="12" cy="10" r="4.5" fill="white" opacity=".9"/>
      </g>
    </svg>`;
    return L.divIcon({
      html: svg, className: '',
      iconSize:    [size * 2.2, size * 3],
      iconAnchor:  [size * 1.1, size * 3],
      popupAnchor: [0, -size * 3],
    });
  }

  private boundsValidos(bounds: any): boolean {
    return Array.isArray(bounds) &&
      bounds.length === 2 &&
      Array.isArray(bounds[0]) && bounds[0].length === 2 &&
      Array.isArray(bounds[1]) && bounds[1].length === 2 &&
      !isNaN(bounds[0][0]) && !isNaN(bounds[0][1]) &&
      !isNaN(bounds[1][0]) && !isNaN(bounds[1][1]);
  }

  private clearMarkers() {
    this.markersLayer.clearLayers();
  }

  private addMarkers(cities: Ciudad[], color: string, label: string) {
    // Filtramos ciudades con coordenadas inválidas
    const valid = cities.filter(c =>
      c.lat != null && c.lng != null &&
      !isNaN(c.lat) && !isNaN(c.lng)
    );
  
    valid.forEach(c => {
      const region = this.regiones.find(r => r.id === c.region);
      const pais   = this.paises.find(p => p.id === region?.pais);
      const popup = `
            <div class="popup-inner">
              <h3>${c.nombre}</h3>
              <p>${region?.nombre ?? ''} · ${pais?.nombre ?? ''}</p>
              ${c.poblacion ? `<p class="pop-poblacion">👥 ${c.poblacion.toLocaleString('es-ES')} hab.</p>` : ''}
              <span class="pop-tag" style="background:${color}">${label}</span>
            </div>`;
      L.marker([c.lat, c.lng], { icon: this.makeIcon(color) })
        .addTo(this.markersLayer)
        .bindPopup(popup, { maxWidth: 280 });
    });
  }
  // ── Acciones de mapa ────────────────────────────────────────
  private pintarPais() {
    this.clearMarkers();
    const ciudadesPais = this.ciudades.filter(c => {
      const reg = this.regiones.find(r => r.id === c.region);
      return reg?.pais === this.paisActivo!.id;
    });
    this.addMarkers(ciudadesPais, '#1e9bd7', this.paisActivo!.nombre);

    if (this.boundsValidos(this.paisActivo!.bounds)) {
      this.map.flyToBounds(this.paisActivo!.bounds as L.LatLngBoundsExpression, { duration: 1.2, padding: [30, 30] });
    } else {
      this.map.flyTo([this.paisActivo!.lat, this.paisActivo!.lng],
        this.paisActivo!.zoom, { duration: 1.2 });
    }
  }

  private pintarRegion() {
    this.clearMarkers();
    const ciudadesRegion = this.ciudades.filter(c => c.region === this.regionActiva!.id);
    this.addMarkers(ciudadesRegion, '#2ecc71', this.regionActiva!.nombre);

    if (this.boundsValidos(this.regionActiva!.bounds)) {
      this.map.flyToBounds(this.regionActiva!.bounds as L.LatLngBoundsExpression, { duration: 1, padding: [50, 50] });
    } else if (this.regionActiva!.lat && this.regionActiva!.lng) {
      this.map.flyTo([this.regionActiva!.lat, this.regionActiva!.lng], 9, { duration: 1 });
    }
  }

  private pintarCiudadSeleccionada() {
    this.clearMarkers();
    this.addMarkers([this.ciudadActiva!], '#e74c3c', this.ciudadActiva!.nombre);
    this.map.flyTo([this.ciudadActiva!.lat, this.ciudadActiva!.lng], 13, { duration: 1 });
    setTimeout(() => {
      this.markersLayer.eachLayer(l => {
        if (l instanceof L.Marker) l.openPopup();
      });
    }, 1200);
  }

  reset() {
    if (!this.map) return;
    this.clearMarkers();
    this.map.flyTo([50.5, 10.0], 4, { duration: 1.2 });
  }
}