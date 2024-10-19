import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Breadcrumb, DefaultLayoutService } from '../default-layout.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  menu = [
    {
      icon: 'setting.svg',
      title: 'Overview',
      routerLink: 'overview',
      seperate: false,
    },
    {
      icon: 'chart.svg',
      title: 'Dashboard',
      routerLink: 'dashboard',
      seperate: false,
    },
    {
      icon: 'slider.svg',
      title: 'LEA Management',
      routerLink: 'lea-management',
      seperate: false,
    },
  ];

  isOpen: null | boolean = null;
  currentItemActivate: Breadcrumb[] = [];


  constructor(
    private readonly activatedRouter: ActivatedRoute,
    private readonly router: Router,
    private readonly defaultLayoutService: DefaultLayoutService,
    private readonly titleService: Title
  ) {}

  ngOnInit(): void {
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRouter),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
    )
    .subscribe(data => {
      this.currentItemActivate = this.defaultLayoutService.buildBreadcrumb(this.activatedRouter.root);
      const title = data['breadcrumb'] || 'Default Title';
      this.titleService.setTitle(title);
    });

  }

  toggleOpenMenu(): void {
    this.isOpen = !this.isOpen;
  }

  navigateTo(url: any): void {
    if (typeof url === 'string') {
      this.router.navigate([url]);
    }
  }

  clickOutsideMenu(event: any) {
    if(this.isOpen !== null) {
      this.isOpen = false;
    }
  }
}
