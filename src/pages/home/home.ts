import { Component, ViewChild } from '@angular/core';

import {
 GoogleMaps,
 GoogleMap,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';

import { Platform, NavController } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { RestaurantPage } from '../restaurant/restaurant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') element;

  constructor(public googleMaps: GoogleMaps,
    public plt: Platform,
    public nav: NavController,
    public http: Http) {
  }

  ngAfterViewInit() {
    this.plt.ready().then(() => {
      this.http.get('https://oghuxxw1e6.execute-api.us-east-1.amazonaws.com/dev')
      .map(res => res.json())
      .subscribe(restaurants => this.initMap(restaurants));
    });
  }

  initMap (restaurants) {

    restaurants.forEach((restaurant) => {
      let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);

      let coordinates: LatLng = new LatLng(restaurant.position.lat, restaurant.position.lgn);
      let cameraPosition: CameraPosition = {
        target: coordinates,
         zoom: 17
      };

      // move the map's camera to position
      map.moveCamera(cameraPosition);

      // create new marker
      let markerOptions: MarkerOptions = {
        position: coordinates,
        icon: "assets/images/icons8-Marker-64.png",
        title: restaurant.title ,
        infoClick: () => {
          this.nav.push(RestaurantPage);
        }
      };

      const marker = map.addMarker(markerOptions)
        .then((marker: Marker) => {
          marker.showInfoWindow();
        });
    })
  }
}

