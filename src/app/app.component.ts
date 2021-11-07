import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedTicker: Subject<string> = new BehaviorSubject('A');

  searchForm = new FormGroup({
    company: new FormControl('FB'),
    startDate: new FormControl(''),
  });

  options: any = [];

  filteredOptions: Observable<any[]> | undefined = new Subject<any[]>();
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    // this.searchForm?.controls['company'].value
    this.httpClient.get('assets/companies.json', {}).subscribe((data) => {
      this.options = data;
    });

    this.searchForm.get('company')?.valueChanges.subscribe((value: string) => {
      this.selectedTicker.next(value);
    });

    this.filteredOptions = this.searchForm.get('company')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (option: any) =>
        option.dataset.name.toLowerCase().includes(filterValue) ||
        option.dataset.dataset_code.toLowerCase().includes(filterValue)
    );
  }
}
