import { Component, OnInit } from '@angular/core';
import { Breadcrumb, DefaultLayoutService } from '../../default-layout.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly defaultLayoutService: DefaultLayoutService
  ) {}

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.defaultLayoutService.buildBreadcrumb(this.activeRoute.root))
    )
    .subscribe(breadcrumbs =>{
        this.breadcrumbs = breadcrumbs;
        console.log(this.breadcrumbs)
    });
   
  }
}
