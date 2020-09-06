import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { FindPage } from '../find/find';

import {Http} from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-rent',
  templateUrl: 'rent.html'
})
export class RentPage {
  private baseURL = "http://129.2.24.226:8080/mps/cdelgran/geog650/final/"
  showOtherInput: boolean = false;
  
  data: any;
  pageMessage: String;
  formData: any;
 

  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http) {

    this.formData = {
      tent: false,
      chair: false,
      hammock: false,
      warmsleeping: false,
      coldsleeping: false,
      sleepingpad: false,
      stove: false,
      stovekit: false,
      poles: false,
      largepack: false,
      medpack: false,
      smallpack: false,

     
    };
    }
    insertCampgrounds(){
      var url = this.baseURL + "insert_campsites.php";

    }



    goToFindPage(){

      let inputData = {
        data: this.formData
      }
      this.navCtrl.push(FindPage, inputData);
      
    }

    goToRentPage(){
      this.navCtrl.push(RentPage);
      this.formData = {
        tent: false,
        chair: false,
        hammock: false,
        warmsleeping: false,
        coldsleeping: false,
        sleepingpad: false,
        stove: false,
        stovekit: false,
        poles: false,
        largepack: false,
        medpack: false,
        smallpack: false,
    }
  }
}

