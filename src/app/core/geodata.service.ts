import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { GeoData } from '../models/geodata.model';

@Injectable({ providedIn: 'root' })
export class GeodataService {

  private readonly url = 'assets/geodata.json';

  // shareReplay(1) → hace el fetch una sola vez aunque haya
  // varios componentes suscritos
  private data$ = this.http.get<GeoData>(this.url).pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  getGeoData(): Observable<GeoData> {
    return this.data$;
  }
}