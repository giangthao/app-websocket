import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RandomValueService {
  private readonly URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getValue(valueDTO: any): Observable<any> {
    return this.http.post(`${this.URL}/api/interval`, valueDTO);
  }

  startPolling(timer: number, valueDTO: any): Observable<any> {
    return interval(timer * 1000).pipe(
      startWith(0),
      switchMap(() => this.getValue(valueDTO))
    );
  }
}
