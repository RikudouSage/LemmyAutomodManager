import {effect, Injectable, signal} from '@angular/core';
import {environment} from "../../environments/environment";
import {Title} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  public readonly title = signal(environment.appTitle);

  constructor(
    angularTitle: Title,
  ) {
    effect(() => {
      angularTitle.setTitle(this.title());
    });
  }
}
