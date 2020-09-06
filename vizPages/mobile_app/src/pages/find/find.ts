import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {ViewController} from 'ionic-angular';

import { AlertController } from 'ionic-angular';

import { RentPage } from '../rent/rent';
import { MapPage } from '../map/map';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map'

declare var google

@Component({
  selector: 'page-find',
  templateUrl: 'find.html'
})
export class FindPage {
  private baseURL = "http://129.2.24.226:8080/mps/cdelgran/geog650/final/";
  formData: any;
  places: Array<any>;
  rentData: any;
  showOtherInput: boolean = false;
  data: any; 
  latitude: Number;
  longitude: Number;
  searchDistance: Number = 3000;
  pageMessage: String 
  mapWow: any;
  currentLocation: any;
  flagPublishAddress: boolean = false;
  address: String;
  subscribe: boolean;
  searchType: String;
  geocoder: any;
  markers: any;
  autocomplete: any;
  autocompleteItems: any;
  GoogleAutocomplete:any;
 


  camp = {name: 'Campgrounds', searchType: 'campground'}
  tent = {subtitle: 'tent'}

  deliverys = ["To Camp", "Ship Ahead"]
  states = ["Select State","AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"]

  

initializeFields(){
  this.formData.meetDate =(new Date().toISOString());
  this.findCurrentLocation();
  }
  
 
  findCurrentLocation(){
    this.geolocation.getCurrentPosition().then((position)=>{
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(position);
    }); 
  }


  ionViewWillEnter(){
    this.initializeFields();
  }
  constructor(public viewCtrl: ViewController, private zone: NgZone, public navCtrl: NavController, public http: Http, public geolocation: Geolocation,  public events: Events, public params: NavParams, public modalCtrl: ModalController,public alertCtrl: AlertController) {
    this.rentData = params.get('data');
    if (this.rentData.tent == true){
    this.rentData.tent = "1 Tent  <br/>";
    }
    else {this.rentData.tent = "";}

    if (this.rentData.chair == true){
      this.rentData.chair = " 1 Chair <br/>";
      }
    else {this.rentData.chair == <string>this.rentData.chair;
      this.rentData.chair = ""}
    if (this.rentData.hammock == true){
        this.rentData.hammock = " 1 Hammock <br/>";
        }
    else {this.rentData.hammock = "";}
    if (this.rentData.warmsleeping == true){
      this.rentData.warmsleeping = "1 Pod Sleeping Bag <br/>";
      }
    else {this.rentData.warmsleeping = ""}
    if (this.rentData.coldsleeping == true){
        this.rentData.coldsleeping = " 1 2.0 Sleeping Bag <br/>";
        }
    else {this.rentData.coldsleeping = "";}
    if (this.rentData.sleepingpad == true){
          this.rentData.sleepingpad = " 1 Sleeping Pad <br/>";
          }
    else {this.rentData.sleepingpad = "";}
    if (this.rentData.stove == true){
      this.rentData.stove = "1 Jetboil Stove <br/>";
      }
    else {this.rentData.stove = "";}
    if (this.rentData.stovekit == true){
        this.rentData.stovekit = "1 Full Stove & Kitchen Set <br/>";
        }
    else {this.rentData.stovekit = "";}
    if (this.rentData.poles == true){
      this.rentData.poles = "1 Trekking Poles <br/>";
      }
    else {this.rentData.poles = "";}
    if (this.rentData.largepack == true){
        this.rentData.largepack = "1 Large 70 Pack <br/>";
        }
    else {this.rentData.largepack = "";}
    if (this.rentData.medpack == true){
          this.rentData.medpack = "1 Medium 45 Pack <br/>";
          }
    else {this.rentData.medpack = "";}
    if (this.rentData.smallpack == true){
      this.rentData.smallpack = "1 Small 25 Pack <br/>";
      }
    else {this.rentData.smallpack = "";}

    this.formData = {
      delivery: ["To Camp"],
      address: "",
      state: ["Select State"],
      zip: "",
      campsites: "",
      meetDate: "",
      
    }
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
   
  }

  openModalMapPage():void{
    this.findCurrentLocation();
      let modalMapPage = this.modalCtrl.create(MapPage,{
        latitude: this.latitude,
        longitude: this.longitude
      });
  }
showAlert(){ 
    const alert = this.alertCtrl.create({
      title: 'Your Basket',
      subTitle: this.rentData.tent + this.rentData.chair + this.rentData.hammock + this.rentData.warmsleeping + this.rentData.coldsleeping + this.rentData.sleepingpad +
      this.rentData.stove + this.rentData.stovekit + this.rentData.poles + this.rentData.largepack + this.rentData.medpack + this.rentData.smallpack,
      buttons: ['OK']
    })
    alert.present();
  }

  onShipDelivery(){
    if(this.formData.delivery == "Ship Ahead"){
      this.showOtherInput = true;    
    }
    else{
      this.showOtherInput = false;  
    }
  }
  
  insertCampgrounds(){
    var url = this.baseURL + "insert_campsites.php";

    var params = new URLSearchParams();
    params.append('tent', this.rentData.tent)
    params.append('chair', this.rentData.chair)
    params.append('hammock', this.formData.hammock);
    params.append('warmsleeping', this.formData.warmsleeping);
    params.append('coldsleeping', this.formData.coldsleeping);
    params.append('sleepingpad', this.formData.sleepingpad);
    params.append('stove', this.formData.stove);
    params.append('stovekit', this.formData.stovekit);
    params.append('poles', this.formData.poles);
    params.append('largepack', this.formData.largepack);
    params.append('medpack', this.formData.medpack);
    params.append('smallpack', this.formData.smallpack);
    params.append('delivery', this.formData.delivery);
    params.append('address', this.formData.address);
    params.append('state', this.formData.state);
    params.append('zip', this.formData.zip);
    params.append('campsites', this.formData.campsites);
    params.append('meetDate', this.formData.meetDate);
    console.log(params);
    this.http.post(url,params)
    .map(response => response.json())
    .subscribe(data =>{
      console.log(data);
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


ionViewDidEnter(){
	this.mapWow = new google.maps.Map(document.getElementById('mapWow'), {
		center: { lat: 40.73, lng: -73.935 },
    zoom: 12
	});
}


/*I used https://developers.google.com/places/web-service/autocomplete & https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete to help complete this portion */

updateSearchResults(){
  if (this.autocomplete.input == '') {
    this.autocompleteItems = [];
    return;
  }
  this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
	(predictions, status) => {
    this.autocompleteItems = [];
    this.zone.run(() => {
      predictions.forEach((prediction) => {
        this.autocompleteItems.push(prediction);
      });
    });
  });
}
selectSearchResult(item){
  this.autocompleteItems = [];

  this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
    if(status === 'OK' && results[0]){
      let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng,
          name: results[0].geometry.location.name
      };
     
      let marker = new google.maps.Marker({
        position: results[0].geometry.location,
        map: this.mapWow,
        animation: google.maps.Animation.DROP,
        title: 'unknown'
      });
      this.markers.push(marker);
      this.mapWow.setCenter(results[0].geometry.location);
      let infowindow = new google.maps.InfoWindow({
        //content: place.formatted_address;
      });
      marker.addListener('click', function(){
      infowindow.open(this.mapWow, marker);
      });

    }
  });
}
}

  


