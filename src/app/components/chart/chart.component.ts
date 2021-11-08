import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  CandleStickData,
  CandleStickGraph,
} from 'src/app/lib/interfaces/candlestick.interface';
import { QuandlDatasetResponse } from 'src/app/lib/interfaces/dataset.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  @Input() ticker: Subject<string> = new Subject<string>();

  @Output() loadedValues: EventEmitter<any> = new EventEmitter();

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
  };

  public graph: CandleStickGraph = {
    data: [],
    layout: { autsize: true, title: '-- Choose company to view data --' },
  };

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.ticker.subscribe((val: string) => {
      if (val != null || val != undefined) {
        const url = `https://data.nasdaq.com/api/v3/datasets/WIKI/${val}.json?start_date=2012-01-01&end_date=2018-01-31&api_key=Dsh3qzwuRKxcaFsAw4TJ`;
        this.httpClient.get(url).subscribe((data) => {
          const quandlDatasetResponse = data as QuandlDatasetResponse;
          const quandlDataset = quandlDatasetResponse.dataset;

          this.graph.layout.title = quandlDataset.name;

          for (const datum of quandlDataset.data) {
            this.candleStickData.x.push(datum[0]);
            this.candleStickData.close.push(datum[4]);
            this.candleStickData.open.push(datum[1]);
            this.candleStickData.high.push(datum[2]);
            this.candleStickData.low.push(datum[3]);
          }

          this.graph.data = [this.candleStickData];

          this.loadedValues.emit(true);
        });
      } else {
        this.loadedValues.emit(true);
      }
    });
  }

  fetchCompanyEOD() {}
}
