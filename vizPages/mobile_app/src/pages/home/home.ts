import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MapPage } from '../map/map';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'


})
export class HomePage {
  latitude: Number;
  longitude: Number;
  searchDistance: Number = 3000;
  camp = {name: 'Campgrounds', searchType: 'campground'}
  constructor(public navCtrl: NavController,public geolocation: Geolocation) {

  }
  findCurrentLocation(){
    this.geolocation.getCurrentPosition().then((position)=>{
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(position);
    }); 
  }
  goToMapPage(queryName: String, queryType: String){
    this.navCtrl.push(MapPage,{
      latitude: this.latitude,
      longitude: this.longitude,
      keyword: queryName,
      type: queryType,
      distance: this.searchDistance, 
     
    });
  }
}
