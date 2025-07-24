import {Component, computed, OnInit, signal} from '@angular/core';
import {TranslocoPipe} from "@jsverse/transloco";
import {NavItemComponent} from "../nav-item/nav-item.component";
import {Feature, IsFeatureAvailable} from "../../../helper/feature-map";
import {NewVersionCheckerService} from "../../../services/new-version-checker.service";

@Component({
  selector: 'app-left-menu',
  standalone: true,
  imports: [
    TranslocoPipe,
    NavItemComponent
  ],
  templateUrl: './left-menu.component.html',
  styleUrl: './left-menu.component.scss'
})
export class LeftMenuComponent implements OnInit {
  private readonly currentApiVersion = signal<string | null>(null);
  protected readonly externalListsEnabled = computed(() => {
    if (!this.currentApiVersion()) {
      return false;
    }

    return IsFeatureAvailable(Feature.ExternalLists, this.currentApiVersion()!);
  });
  protected readonly complexRulesEnabled = computed(() => {
    if (!this.currentApiVersion()) {
      return false;
    }

    return IsFeatureAvailable(Feature.ComplexRules, this.currentApiVersion()!);
  });

  constructor(
    private newVersionChecker: NewVersionCheckerService,
  ) {
  }

  public async ngOnInit() {
    this.currentApiVersion.set(await this.newVersionChecker.getCurrentApiVersion());
  }
}
