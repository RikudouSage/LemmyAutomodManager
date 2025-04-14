import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  Signal,
  signal,
  viewChild
} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {TranslocoPipe} from "@jsverse/transloco";
import {environment} from "../environments/environment";
import {TitleService} from "./services/title.service";
import {LeftMenuComponent} from "./root/components/left-menu/left-menu.component";
import {FooterComponent} from "./root/components/footer/footer.component";
import {TopMenuComponent} from "./root/components/top-menu/top-menu.component";
import {NewVersionCheckerService} from "./services/new-version-checker.service";
import {ToastrService} from "ngx-toastr";
import {TranslatorService} from "./services/translator.service";
import {toPromise} from "./helper/resolvable";
import {interval, timeout} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoPipe, RouterLink, LeftMenuComponent, FooterComponent, TopMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly autoCollapse = 992;
  private readonly isBrowser: boolean;

  public readonly appVersion: string = environment.appVersion;
  public readonly appTitle: string = environment.appTitle;

  private sideMenu: Signal<ElementRef<HTMLElement> | undefined> = viewChild('sideMenu');
  private sideMenuToggle: Signal<ElementRef<HTMLAnchorElement> | undefined> = viewChild('sideMenuToggle');

  public darkModeEnabled = signal(false);
  public title: Signal<string>;

  constructor(
    @Inject(PLATFORM_ID) platformId: string,
    @Inject(DOCUMENT) private readonly document: Document,
    titleService: TitleService,
    private readonly newVersionChecker: NewVersionCheckerService,
    private readonly toastr: ToastrService,
    private readonly translator: TranslatorService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.title = titleService.title;
  }

  public async ngOnInit(): Promise<void> {
    this.calculateDarkMode();

    if (this.isBrowser) {
      const versionCheck = await this.newVersionChecker.newVersionCheck();
      if (versionCheck.newUiVersionAvailable) {
        const toast = this.toastr.info(
          await toPromise(this.translator.get('app.new_version_available.ui')),
          await toPromise(this.translator.get('app.info')),
          {
            disableTimeOut: true,
          }
        );
        toast.onTap.subscribe(() => {
          window.open('https://github.com/RikudouSage/LemmyAutomodManager', '_blank');
        });
      }
      if (versionCheck.newApiVersionAvailable) {
        const toast = this.toastr.info(
          await toPromise(this.translator.get('app.new_version_available.api')),
          await toPromise(this.translator.get('app.info')),
          {
            disableTimeOut: true,
          }
        );
        toast.onTap.subscribe(() => {
          window.open('https://github.com/RikudouSage/LemmyAutomod', '_blank');
        });
      }
    }
  }

  public async toggleSideMenu(): Promise<void> {
    const body = this.document.body;
    if (body.classList.contains('sidebar-collapse')) {
      if (window.outerWidth <= this.autoCollapse) {
        body.classList.add('sidebar-open');
      }
      body.classList.remove('sidebar-collapse');
      body.classList.remove('sidebar-closed');
    } else {
      await this.hideMenu();
    }
  }

  private calculateDarkMode() {
    if (!this.isBrowser) {
      return;
    }

    const darkModeDetected = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (darkModeDetected) {
      this.document.body.classList.add('dark-mode');
    } else {
      this.document.body.classList.remove('dark-mode');
    }
    this.darkModeEnabled.set(darkModeDetected);
  }

  private async hideMenu(): Promise<void> {
    const body = this.document.body;
    if (window.outerWidth <= this.autoCollapse) {
      body.classList.remove('sidebar-open');
      body.classList.add('sidebar-closed');
    }
    body.classList.add('sidebar-collapse');
  }

  @HostListener('body:click', ['$event'])
  public async onBodyClicked(event: Event): Promise<void> {
    if (this.sideMenu() !== undefined && this.sideMenuToggle() !== undefined) {
      if (this.sideMenu()!.nativeElement.contains(<HTMLElement>event.target) || this.sideMenuToggle()!.nativeElement.contains(<HTMLElement>event.target)) {
        return;
      }
      if (window.outerWidth <= this.autoCollapse) {
        await this.hideMenu();
      }
    }
  }
}
