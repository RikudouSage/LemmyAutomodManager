import {ApplicationConfig, provideZoneChangeDetection, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {TranslocoHttpLoader} from './transloco-loader';
import {provideTransloco} from '@jsverse/transloco';
import {translocoMarkupRouterLinkRenderer} from "ngx-transloco-markup-router-link";
import {defaultTranslocoMarkupTranspilers, provideTranslationMarkupTranspiler} from "ngx-transloco-markup";
import {ParagraphTranslocoTranspiler} from "./services/transloco-transpiler/paragraph-transloco.transpiler";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideToastr} from "ngx-toastr";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideTransloco({
      config: {
        availableLangs: ['en'],
        defaultLang: 'en',
        fallbackLang: 'en',
        // reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        missingHandler: {
          allowEmpty: true,
          useFallbackTranslation: true,
        }
      },
      loader: TranslocoHttpLoader,
    }),
    defaultTranslocoMarkupTranspilers(),
    translocoMarkupRouterLinkRenderer(),
    provideTranslationMarkupTranspiler(ParagraphTranslocoTranspiler),
    provideToastr({
      maxOpened: 3,
      autoDismiss: true,
      timeOut: 10_000,
      closeButton: true,
      progressBar: true,
      enableHtml: true,
    }),
  ]
};
