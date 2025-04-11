import {Injectable} from '@angular/core';
import {BlockTranspiler, TranslationMarkupRenderer, TranslationMarkupRendererFactory} from "ngx-transloco-markup";

@Injectable({
  providedIn: 'root'
})
export class ParagraphTranslocoTranspiler extends BlockTranspiler {
  constructor(
    private readonly rendererFactory: TranslationMarkupRendererFactory,
  ) {
    super('[p]', '[/p]');
  }

  protected override createRenderer(childRenderers: TranslationMarkupRenderer[]): TranslationMarkupRenderer {
    return this.rendererFactory.createElementRenderer('p', childRenderers);
  }
}
