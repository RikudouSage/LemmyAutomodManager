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
import {LeftMenuComponent} from "./components/left-menu/left-menu.component";
import {FooterComponent} from "./components/footer/footer.component";
import {TopMenuComponent} from "./components/top-menu/top-menu.component";

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
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.title = titleService.title;
  }

  public async ngOnInit(): Promise<void> {
    this.calculateDarkMode();
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
