import { Injectable } from '@angular/core';
import { concat, Observable, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly URL = 'ws://localhost:3001';
  private webSocketSubject = webSocket<string>(this.URL);
  public webSocket$ = this.webSocketSubject.asObservable();

  updateInterval(interval: number): void {
      const initialCall$ = new Observable(subscriber => {
        this.webSocketSubject.next(JSON.stringify(interval)); 
        subscriber.next(); 
        subscriber.complete(); 
      });
      const oneMinus = 60 * 1000;
      const delayedCalls$ = timer(oneMinus, oneMinus).pipe(
        tap(() => this.webSocketSubject.next(JSON.stringify(interval))) 
      );
      
      concat(initialCall$, delayedCalls$).subscribe();
  }
}
