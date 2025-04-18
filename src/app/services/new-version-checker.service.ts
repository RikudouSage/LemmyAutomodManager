import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {toPromise} from "../helper/resolvable";
import {catchError, map} from "rxjs/operators";
import {from} from "rxjs";

export interface NewVersionCheckResult {
  currentUiVersion: string;
  latestUiVersion: string;
  currentApiVersion: string;
  latestApiVersion: string;
  newUiVersionAvailable: boolean;
  newApiVersionAvailable: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NewVersionCheckerService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  public newVersionCheck(): Promise<NewVersionCheckResult> {
    return toPromise(this.httpClient.post<NewVersionCheckResult>(`${environment.apiUrl}/api/internal/version-check/check`, {
      uiVersion: environment.appVersion,
    }));
  }

  public getCurrentApiVersion(): Promise<string> {
    return toPromise(
      this.httpClient.get<{version: string}>(`${environment.apiUrl}/api/internal/version-check/api-version`).pipe(
        map (response => response.version),
        catchError(() => from(this.newVersionCheck()).pipe(
          map (result => result.currentApiVersion),
        )),
      ),
    );
  }
}
