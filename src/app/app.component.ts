import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  selectedTicker: Subject<string> = new Subject();
  showSpinner: boolean = false;
  searchForm = new FormGroup({
    company: new FormControl(),
    startDate: new FormControl(new Date(), []),
    endDate: new FormControl(new Date(), []),
  });

  options: any = [];

  filteredOptions: Observable<any[]> | undefined = new Subject<any[]>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    let startDate = new Date();
    startDate.setFullYear(2012);
    startDate.setMonth(0);

    this.searchForm.controls['startDate']?.patchValue(startDate);

    this.showSpinner = true;
    this.httpClient
      .get('assets/companies.json', {})
      .toPromise()
      .then((data) => {
        this.options = data;
        this.filteredOptions = this.searchForm
          .get('company')
          ?.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
          );
        this.finishedLoading();
      });
  }

  viewData(event?: any, option?: any) {
    this.showSpinner = true;
    // this.searchForm.get('company')?.setValue(option.dataset_code);
    this.selectedTicker.next('reload');
  }

  private _filter(value: string): string[] {
    if (value == null || value == undefined) return this.options;
    const filterValue = value.toLowerCase();
    return _.filter(this.options, (option: any) => {
      return (
        option.name.toLowerCase().includes(filterValue) ||
        option.dataset_code.toLowerCase() === filterValue
      );
    });
  }

  finishedLoading(event?: any) {
    this.showSpinner = event;
  }
}
