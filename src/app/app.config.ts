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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(),
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
  ]
};
