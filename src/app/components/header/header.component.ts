import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Lang } from '../../services/translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() pinCount: number = 0;
  @Output() inicio = new EventEmitter<void>();

  readonly langs: Lang[] = ['es', 'en', 'eu'];
  currentLang: Lang = 'es';

  private sub!: Subscription;

  constructor(public i18n: TranslationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.i18n.lang$.subscribe(lang => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setLang(lang: Lang): void {
    this.i18n.setLang(lang);
  }
}