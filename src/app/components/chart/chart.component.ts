import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  CandleStickData,
  CandleStickGraph,
} from 'src/app/lib/interfaces/candlestick.interface';
import { QuandlDatasetResponse } from 'src/app/lib/interfaces/dataset.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() ticker: Subject<string> = new Subject<string>();

  @Input()
  searchForm: FormGroup = new FormGroup({
    company: new FormControl(),
    startDate: new FormControl(new Date(), []),
    endDate: new FormControl(new Date(), []),
  });

  @Output() showSpinner: EventEmitter<any> = new EventEmitter();

  public layout = {
    dragmode: 'zoom',
    margin: {
      r: 10,
      t: 25,
      b: 40,
      l: 60,
    },
    showlegend: true,
    xaxis: {
      autorange: true,
      domain: [0, 1],
      title: 'Date',
      type: 'date',
    },
    yaxis: {
      autorange: true,
      domain: [0, 1],
      type: 'linear',
      title:'Price'
    },
  };

  public candleStickData: CandleStickData = {
    x: [],
    close: [],
    decreasing: { line: { color: '#7F7F7F' } },
    high: [],
    increasing: { line: { color: '#17BECF' } },
    line: { color: 'rgba(31,119,180,1)' },
    low: [],
    open: [],
    type: 'candlestick',
    xaxis: 'x',
    yaxis: 'y',
    name:  this.searchForm.get('company')?.value
  };

  public graph: CandleStickGraph = {
    data: [],
    layout: { autsize: true, title: '-- Choose company to view data --' },
  };

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.ticker.subscribe(() => {
      this.fetchCompanyEOD();
    });
  }

  fetchCompanyEOD() {
    this.candleStickData.x = [];
    this.candleStickData.close = [];
    this.candleStickData.open = [];
    this.candleStickData.high = [];
    this.candleStickData.low = [];

    this.showSpinner.emit(true);

    const startDate: Date = this.searchForm.get('startDate')?.value;
    const endDate: Date = this.searchForm.get('endDate')?.value;

    const url = `https://data.nasdaq.com/api/v3/datasets/WIKI/${
      this.searchForm.get('company')?.value
    }.json?start_date=${startDate.getFullYear()}-${
      startDate.getMonth() + 1
    }-${startDate.getDate()}&end_date=${endDate.getFullYear()}-${
      endDate.getMonth() + 1
    }-${endDate.getDate()}&api_key=${environment.quandlApiKey}`;
    this.httpClient.get(url).subscribe((data) => {
      const quandlDatasetResponse = data as QuandlDatasetResponse;
      const quandlDataset = quandlDatasetResponse.dataset;

      this.graph.layout.title = quandlDataset.name;

      let smas: number[] = [];
      for (const datum of quandlDataset.data) {
        this.candleStickData.x.push(datum[0]);
        this.candleStickData.close.push(datum[4]);
        this.candleStickData.open.push(datum[1]);
        this.candleStickData.high.push(datum[2]);
        this.candleStickData.low.push(datum[3]);
      }

      smas = this.calculateSMA20(this.candleStickData.close, 20)
      
      this.graph.data = [
        this.candleStickData,
        {
          x:this.candleStickData.x,
          y: smas,
          mode: 'lines',
          name: 'SMA20'
        },
      ];
      this.showSpinner.emit(false);
    });
  }

  /**
   *
   * @param data
   * @param windowSize
   * @returns
   */
  calculateSMA20(data: number[], windowSize: number): number[] {
    let rAvgs = [],
      avgPrev = 0;
    for (let i = 0; i <= data.length - windowSize; i++) {
      let currAvg = 0.0,
        t = i + windowSize;
      for (let k = i; k < t && k <= data.length; k++) {
        currAvg += data[k] / windowSize;
      }
      rAvgs.push(currAvg);
      avgPrev = currAvg;
    }
    return rAvgs;
  }
}
