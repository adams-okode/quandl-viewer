export interface QuandlDataset {
  collapse: null;
  column_index: null;
  column_names: string[];
  data: any[];
  database_code: string;
  database_id: number;
  dataset_code: string;
  description: string;
  end_date: string;
  frequency: string;
  id: number;
  limit: any;
  name: string;
  newest_available_date: string;
  oldest_available_date: string;
  order: null;
  premium: false;
  refreshed_at: Date;
  start_date: string;
  transform: null;
  type: string;
}

export interface QuandlDatasetResponse {
  dataset: QuandlDataset;
}
