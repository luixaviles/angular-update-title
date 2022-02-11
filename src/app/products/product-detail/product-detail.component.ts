import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subscription, tap } from 'rxjs';
import { TitleService } from 'src/app/shared/services/title.service';

@Component({
  selector: 'corp-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  protected subscription = new Subscription();

  productId$ = this.route.params.pipe(map((params) => params['id']));

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {}

  ngOnInit(): void {
    const productIdSubscription = this.productId$
      .pipe(
        tap((id) => this.titleService.title$.next(`Product Detail - ${id}`))
      )
      .subscribe();

    this.subscription.add(productIdSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
