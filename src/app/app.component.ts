import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
    startDate: new FormControl(''),
  });

  options: any = [];

  filteredOptions: Observable<any[]> | undefined = new Subject<any[]>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get('assets/companies.json', {}).subscribe((data: any) => {
      this.options = data;
    });

    this.filteredOptions = this.searchForm.get('company')?.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  viewData(event: any, option?:any) {
    this.showSpinner = true;
    this.searchForm.get('company')?.setValue(option.dataset_code);
    this.selectedTicker.next(option.dataset_code);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return _.filter(this.options, (option: any) => {
      return (
        option.name.toLowerCase().includes(filterValue) ||
        option.dataset_code.toLowerCase() === filterValue
      );
    }).slice(0, 20);
  }

  finishedLoading(event:any){
    if(this.showSpinner){
      this.showSpinner = false;
    }
  }
}
