import { Component } from '@angular/core';

import { FindPage } from '../find/find';
import { RentPage } from '../rent/rent';
import { HomePage } from '../home/home';
import { ConfirmationPage } from '../confirmation/confirmation';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = RentPage;

  tab3Root = ConfirmationPage;

  constructor() {

  }
}
