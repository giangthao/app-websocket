import { Component, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';
import { Subject } from 'rxjs';
import { RandomValueService } from 'src/app/services/random-value.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private stop$ = new Subject<void>(); 
  public interval: number = 1 * 60 * 5;
  valueReponse: string[] = [];

  constructor(private ws: WebSocketService, private randomValueService: RandomValueService) {
    this.callWebSocket();
  }

  ngOnInit(): void {
     console.log('oninit')
    // this.callPolling();
  }

  updateInterval(interval: number) {
    this.interval = interval;
    this.ws.updateInterval(interval);
  }

  callPolling() {
    const valueDTO = {
      interval: this.interval
   }

   this.randomValueService.startPolling(this.interval, valueDTO).subscribe(
     (res) => {
       this.valueReponse.push(res.randomValue);
     },
     (error) => {
       console.log(error)
     }
   )
  }

  callWebSocket() {
    // this.ws.webSocket$
    //   .pipe(
    //     catchError((error) => {
    //       this.interval = 1;
    //       return throwError(() => new Error(error));
    //     }),
    //     retryWhen((errors) =>
    //       errors.pipe(
    //         concatMap(
    //           (error, index) =>
    //             index < 3 // Retry up to 3 times
    //               ? timer(5000) // Delay of 5 seconds before the next retry
    //               : throwError(() => new Error(error)) // Throw error if retries exceeded
    //         )
    //       )
    //     ),
    //     takeUntil(this.stop$) // Define stop$ as an Observable for completion logic
    //   )
    //   .subscribe((value: string) => {
    //     this.valueReponse.push(value);
    //   });

      this.ws.updateInterval(this.interval);
      this.ws.webSocket$.subscribe({
        next: (res) => {
          console.log('Nhận dữ liệu từ WebSocket:', res);
          this.valueReponse.push(res);
        },
        error: (err) => {
          console.error('WebSocket error:', err);
        },
        complete: () => {
          console.log('WebSocket kết thúc.');
        }
      });
  }

 
  stop() {
    this.stop$.next();  // to stop the observable stream, emit a value to stop$:
  }
}
