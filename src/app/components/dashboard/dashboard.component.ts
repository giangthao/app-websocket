import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/services/websocket.service';
import { RandomValueService } from 'src/app/services/random-value.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public interval: number = 1 * 60 * 5;
  valueReponse: string[] = [];
  messages: any[] = [];

  formDashboard: FormGroup;

  constructor(
    private ws: WebSocketService,
    private randomValueService: RandomValueService
  ) {
    //.callWebSocket();
    this.formDashboard = new FormGroup({
      network: new FormControl('VIETTEL'),
    });
  }

  ngOnInit(): void {
    console.log('oninit');
    // this.callPolling();
    this.ws.connect({reconnect: false}, {network: this.formDashboard.get('network')?.value,
      from: '2021-01-01',
      to: '2021-12-31',});
    this.ws.messages$.subscribe(
      (message) => {
        if (message.data) {
          this.messages = message.data;
        } else {
          this.messages = [];
        }

        console.log('Received message:', message);
      },
      (error) => {
        console.log('Error log in component: ', error)
      }
    );

    this.formDashboard.valueChanges.subscribe((value) => {
      this.ws.sendMessage({
        network: value.network,
        from: '2021-01-01',
        to: '2021-12-31',
      });
    });

    this.ws.sendMessage({
      network: this.formDashboard.get('network')?.value,
      from: '2021-01-01',
      to: '2021-12-31',
    });
  }

  ngOnDestroy(): void {
    this.ws.closeConnection();
  }

  callPolling() {
    const valueDTO = {
      interval: this.interval,
    };

    this.randomValueService.startPolling(this.interval, valueDTO).subscribe(
      (res) => {
        this.valueReponse.push(res.randomValue);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
