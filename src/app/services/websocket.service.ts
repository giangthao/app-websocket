import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, timer, EMPTY, iif, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, delayWhen, retryWhen, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | undefined;
  private readonly URL = 'ws://localhost:3001';
  private reconnectInterval: number = 5000; // 5 seconds
  private reconnectAttempts: number = 3;

  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable(); // Expose as observable to components

  constructor() {}

  /**
   * Connect to WebSocket server
   */
  connect(
    cfg: { reconnect: boolean } = { reconnect: false },
    message?: any
  ): void {
    console.log('Is reconnect?', cfg.reconnect);
    console.log('Connecting....');
    if (!this.socket$ || this.socket$.closed) {
      console.log('Connecting to WebSocket...');
      this.socket$ = this.getNewWebSocket();

      // Manage messages from WebSocket
      this.socket$
        .pipe(
          cfg.reconnect ? this.reconnect(message) : (o) => o,
          // tap({
          //   error: (error) => console.log('WebSocket error:', error),
          // }),
          // catchError((_) => EMPTY)
          retryWhen((errors) => {
            return errors.pipe(
              tap((error) => {
                console.log('Error: ', error);
              }),
              concatMap((e, i) =>
                iif(
                  () => i < this.reconnectAttempts,
                  of(e).pipe(delay(this.reconnectInterval)),
                  throwError('Max amount of retries reached')
                )
              )
            );
          })
        )
        .subscribe((message) => this.messagesSubject$.next(message));
    }
  }

  /**
   * Create a new WebSocket connection
   */
  private getNewWebSocket(): WebSocketSubject<any> {
    return webSocket({
      url: this.URL,
      openObserver: {
        next: () => {
          console.log('Connection established');
        },
      },
      closeObserver: {
        next: () => {
          console.log('Connection closed');
          this.socket$ = undefined;
          // this.connect({ reconnect: true }); // Reconnect when closed
        },
      },
    });
  }

  /**
   * Reconnection logic
   */
  private reconnect(message?: any) {
    console.log('Reconnection ...');
    return (source$: Observable<any>) =>
      source$.pipe(
        retryWhen((errors) =>
          errors.pipe(
            tap((attempt) =>
              console.log(`Reconnection attempt #${attempt + 1}`)
            ),
            delayWhen(() => timer(this.reconnectInterval)), // 5-seconds delay between reconnect attempts
            tap({
              complete: () => {
                console.log('Max retries reached. Disconnecting...');
              },
            })
          )
        ),
        tap(() => {
          // After reconnecting, send the message if a payload exists
          if (message) {
            this.sendMessage(message);
            console.log('Message sent after reconnection:', message);
          }
        })
      );
  }

  /**
   * Send a message via WebSocket
   */
  sendMessage(message: any): void {
    console.log(message);
    if (this.socket$ && this.socket$.closed === false) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is closed');
    }
  }

  /**
   * Close WebSocket connection
   */
  closeConnection(): void {
    if (this.socket$) {
      this.socket$.complete();
      console.log('WebSocket connection closed');
    }
  }
}
