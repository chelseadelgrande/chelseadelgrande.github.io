import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { resolveDefinition } from '@angular/core/src/view/util';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  places: Array<any>;
  latitude: Number;
  longitude: Number;
  address: String;
  subscribe: boolean;
  map: any;
  currentLocation: any;
  keyword: String;
  searchType: String;
  distance: Number;
  destination: any;
  origin: any;
  directionService: any;
  distPlaces: any;

  flagPublishAddress: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  this.latitude= navParams.get('latitude');
  this.longitude= navParams.get('longitude');
  this.flagPublishAddress = navParams.get('addressRequest');
  this.keyword = navParams.get('keyword');
  this.searchType = navParams.get('type');
  this.distance = navParams.get('distance');
  this.origin = navParams.get('origin');
  this.destination = navParams.get('destination');
  }

  closeModal():void{
    this.navCtrl.pop();
  }

  reverseGeocoding():any{
    var geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject)=>{
      geocoder.geocode({'location':this.currentLocation}), function(results, status){
        if (status == google.maps.GeocoderStatus.OK){
          resolve(results)
        }else{
          reject(status);
        }
    }
  });
}

 ionViewDidLoad() {
  this.queryPlaces().then((results: Array<any>)=>{
    for(let i=0; i< results.length; i++){
      this.createMarker(results[i]);
    }
    this.places = results;
  },(status)=>console.log(status));
}



queryPlaces(){
  this.currentLocation = new google.maps.LatLng(this.latitude, this.longitude);
  
  let mapOptions ={
    zoom: 12,
    center: this.currentLocation, 
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  this.map = new google.maps.Map(document.getElementById('map'), mapOptions)

  let service = new google.maps.places.PlacesService(this.map);

  let request = {
    location: this.currentLocation,
    radius: this.distance,
    type: ['this.searchType'],
    rankBy: google.maps.places.DISTANCE
  };

  return new Promise((resolve, reject)=>{
    service.nearbySearch(request, function(results, status){
      if(status === google.maps.places.PlacesServiceStatus.OK){
          resolve(results);
      }
      else{
        reject(status);
      }
    });
  });

}

createMarker(place){
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: place.geometry.location,
    title: place.name,
  });

  google.maps.event.addListener(marker, 'click', function(){
    let infowindow = new google.maps.InfoWindow({
      content: place.name,
      
    });
  
    infowindow.open (this.map, marker);

  });
}
  /*attempt to calculate distance between routes: https://developers.google.com/maps/documentation/javascript/distancematrix & 
  https://stackoverflow.com/questions/32259556/distance-service-getdistancematrix-is-never-called-google-maps-api */
  getDistance(index){
    let distPlaces = this.places[index].geometry.location;
  }

  calculateRoute(){
    let directionService = new google.maps.DistanceMatrixService();
    directionService.getDistanceMatrix({
     origin: this.currentLocation,
     destination: this.distPlaces,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
     avoidHighways: false,
    avoidTolls: false,
   }, function(response, status){
    if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
      for (var i = 0; i < response.rows.length; i++) {
        for (var j = 0; j < response.rows[i].elements.length; j++) {
          var distance = response.rows[i].elements[j].distance.text;
          var duration = response.rows[i].elements[j].duration.text;
          var dvDistance = document.getElementById("dvDistance");
        }
      }
    };
  })
 
}
}


