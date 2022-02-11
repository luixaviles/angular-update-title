import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

const DEFAULT_TITLE = 'Corp';

@Injectable({ providedIn: 'root' })
export class TitleService {
  title$ = new BehaviorSubject<string>(DEFAULT_TITLE);

  private titleRoute$: Observable<string | undefined> =
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getPageTitle(this.activatedRoute.firstChild))
    );

  private titleState$ = merge(this.title$, this.titleRoute$).pipe(
    filter((title) => title !== undefined),
    tap((title) => {
      this.titleService.setTitle(`${DEFAULT_TITLE} - ${title}`);
    })
  );

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleState$.subscribe();
  }

  private getPageTitle(
    activatedRoute: ActivatedRoute | null
  ): string | undefined {
    while (activatedRoute) {
      if (activatedRoute.firstChild) {
        activatedRoute = activatedRoute.firstChild;
      } else if (
        activatedRoute.snapshot.data &&
        activatedRoute.snapshot.data['pageTitle']
      ) {
        return activatedRoute.snapshot.data['pageTitle'] as string;
      } else {
        return undefined;
      }
    }
    return undefined;
  }
}
