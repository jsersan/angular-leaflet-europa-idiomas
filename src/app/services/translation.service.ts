import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Lang = 'es' | 'en' | 'eu';

export interface Translations {
  country: string;
  region: string;
  city: string;
  selectCountry: string;
  selectRegion: string;
  selectCity: string;
  legend: string;
  citiesOfCountry: string;
  citiesOfRegion: string;
  selectedCity: string;
  reset: string;
  start: string;
  pin: string;
  pins: string;
  inhabitants: string;
}

export const TRANSLATIONS: Record<Lang, Translations> = {
  es: {
    country:        'País',
    region:         'Región',
    city:           'Ciudad',
    selectCountry:  'Seleccione País',
    selectRegion:   'Seleccione Región',
    selectCity:     'Seleccione Ciudad',
    legend:         'Leyenda',
    citiesOfCountry:'Ciudades del país',
    citiesOfRegion: 'Ciudades de la región',
    selectedCity:   'Ciudad seleccionada',
    reset:          '↺ Restablecer',
    start:          'Inicio',
    pin:            'pin',
    pins:           'pines',
    inhabitants:    'hab.',
  },
  en: {
    country:        'Country',
    region:         'Region',
    city:           'City',
    selectCountry:  'Select Country',
    selectRegion:   'Select Region',
    selectCity:     'Select City',
    legend:         'Legend',
    citiesOfCountry:"Country's cities",
    citiesOfRegion: "Region's cities",
    selectedCity:   'Selected city',
    reset:          '↺ Reset',
    start:          'Home',
    pin:            'pin',
    pins:           'pins',
    inhabitants:    'pop.',
  },
  eu: {
    country:        'Herrialdea',
    region:         'Eskualdea',
    city:           'Hiria',
    selectCountry:  'Hautatu herrialdea',
    selectRegion:   'Hautatu eskualdea',
    selectCity:     'Hautatu hiria',
    legend:         'Legenda',
    citiesOfCountry:'Herrialdearen hiriak',
    citiesOfRegion: 'Eskualdearen hiriak',
    selectedCity:   'Hautatutako hiria',
    reset:          '↺ Berrezarri',
    start:          'Hasiera',
    pin:            'pin',
    pins:           'pinnak',
    inhabitants:    'biz.',
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {

  private langSubject = new BehaviorSubject<Lang>('es');

  /** Observable — subscribe to react to language changes */
  lang$ = this.langSubject.asObservable();

  get currentLang(): Lang {
    return this.langSubject.value;
  }

  setLang(lang: Lang): void {
    this.langSubject.next(lang);
  }

  /** Synchronous translation helper */
  t(key: keyof Translations): string {
    return TRANSLATIONS[this.currentLang][key];
  }

  /** Returns the full translations object for the active language */
  get tr(): Translations {
    return TRANSLATIONS[this.currentLang];
  }
}