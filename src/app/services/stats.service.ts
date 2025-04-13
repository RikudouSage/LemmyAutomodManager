import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {toPromise} from "../helper/resolvable";
import {environment} from "../../environments/environment";

export interface Stats {
  messageCount: number | null;
  notificationChannels: string[];
  lemmyNotificationUsers: string[] | null;
  notifyNewUsers: boolean;
  notifyFirstPostComment: boolean;
  notifyReports: boolean;
  usesFediseer: boolean;
  aiHordeConfigured: boolean;
  signedWebhooks: boolean;
  logLevel: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  constructor(
    private readonly httpClient: HttpClient,
  ) {}

  public getStats(): Promise<Stats> {
    return toPromise(this.httpClient.get<Stats>(`${environment.apiUrl}/api/internal/stats/stats`));
  }
}
