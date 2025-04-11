import {Injectable, signal} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  public readonly title = signal(environment.appTitle);
}
