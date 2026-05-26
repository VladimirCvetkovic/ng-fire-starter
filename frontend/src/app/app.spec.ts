import { TestBed } from '@angular/core/testing';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { App } from './app';
import { CoreThemeService } from './core/services/core-theme.service';
import { CorePaletteService } from './core/services/core-palette.service';

const themeServiceMock = { init: vi.fn() };
const paletteServiceMock = { init: vi.fn() };

describe('App', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        importProvidersFrom(TranslocoTestingModule.forRoot({ langs: { en: {}, sr: {} } })),
        { provide: CoreThemeService, useValue: themeServiceMock },
        { provide: CorePaletteService, useValue: paletteServiceMock },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize theme and palette on init', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(themeServiceMock.init).toHaveBeenCalledOnce();
    expect(paletteServiceMock.init).toHaveBeenCalledOnce();
  });

  it('should set language from localStorage on init', () => {
    localStorage.setItem('lang', 'sr');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const transloco = TestBed.inject(TranslocoService);
    expect(transloco.getActiveLang()).toBe('sr');
    localStorage.removeItem('lang');
  });

  it('should default to "en" when no language is stored', () => {
    localStorage.removeItem('lang');
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const transloco = TestBed.inject(TranslocoService);
    expect(transloco.getActiveLang()).toBe('en');
  });
});
