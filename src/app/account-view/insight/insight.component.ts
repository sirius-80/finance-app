import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/store/app.reducers';
import { Store } from '@ngrx/store';
import { Category, BankAccount } from 'src/app/domain-model/model/model';
import { Observable, from } from 'rxjs';
import { filter, mergeAll, map, withLatestFrom, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.css']
})
export class InsightComponent implements OnInit {
  categories$: Observable<Category[]>;
  selectedCategory$: Observable<Category>;
  categorySummary$;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.categories$ = this.store.select(state => state.domainModel.categories);
    /*this.categorySummary$ = */this.selectedCategory$.pipe(
      withLatestFrom(this.store.select(state => state.domainModel.accounts)),
      map(([category, accounts]: [Category, BankAccount[]]) => from(accounts).pipe(

      ))
    );
  }

  onCategorySelected(categoryId: string) {
    this.selectedCategory$ = this.store.select(state => state.domainModel.categories).pipe(
      mergeAll(),
      filter(c => c.id === categoryId)
    );
  }
}
