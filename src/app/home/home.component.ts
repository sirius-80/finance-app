import { Component, OnInit, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../domain-model/store/domain-model.reducers';
import * as domainModelActions from '../domain-model/store/domain-model.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private store: Store<State>) { }

  ngOnInit() {
    this.store.dispatch(new domainModelActions.LoadAccounts());
  }

}
