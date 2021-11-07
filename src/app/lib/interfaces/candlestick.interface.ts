export interface CandleStickData {
  x: any[];
  close: any[];
  decreasing: { line: { color: '#7F7F7F' } };
  high: any[];
  increasing: { line: { color: '#17BECF' } };
  line: { color: 'rgba(31,119,180,1)' };
  low: any[];
  open: any[];
  type: 'candlestick';
  xaxis: 'x';
  yaxis: 'y';
}

export interface CandleStickGraph {
  data: CandleStickData[];
  layout: {
    autsize: boolean;
    title: string;
  };
}
