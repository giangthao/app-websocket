import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class DefaultLayoutService {
  buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
        breadcrumbs.push({
          label: child.snapshot.data['breadcrumb'] || routeURL,
          url: url,
        });
      }
      return this.buildBreadcrumb(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
