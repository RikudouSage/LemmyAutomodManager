import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, filter, map} from "rxjs/operators";
import {toPromise} from "../helper/resolvable";
import {environment} from "../../environments/environment";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageHashCalculatorService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  public calculateHash(url: string): Promise<string | null> {
    return toPromise(this.httpClient.request<{hash: string}>(new HttpRequest('QUERY', `${environment.apiUrl}/api/internal/images/calculate-hash`, JSON.stringify({
      imageUrl: url,
    }), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    })).pipe(
      filter(response => response instanceof HttpResponse),
      map (response => response.body?.hash ?? null),
      catchError(() => of(null)),
    ));
  }
}
