import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmationPage } from './confirmation';
import { NavController, NavParams, Events } from 'ionic-angular';
import { resolveDefinition } from '@angular/core/src/view/util';
import { Geolocation } from '@ionic-native/geolocation';

import { AlertController } from 'ionic-angular';

import { RentPage } from '../rent/rent';
import {FindPage} from '../find/find'
@NgModule({
  declarations: [
    ConfirmationPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmationPage),
  ],
})


export class ConfirmationPageModule {

}