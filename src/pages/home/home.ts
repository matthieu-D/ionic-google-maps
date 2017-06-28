import { Component, ViewChild } from '@angular/core';

import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
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
    let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);

    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      let cameraCoordinates: LatLng = new LatLng(restaurants[0].position.lat, restaurants[0].position.lgn);

      let cameraPosition = {
        target: cameraCoordinates,
        zoom: 17
      };

      map.animateCamera(cameraPosition);

      restaurants.forEach((restaurant) => {

        let coordinates: LatLng = new LatLng(restaurant.position.lat, restaurant.position.lgn);

        let markerOptions: MarkerOptions = {
          position: coordinates,
          icon: "assets/images/icons8-Marker-64.png",
          title: restaurant.title,
          infoClick: () => {
            this.nav.push(RestaurantPage);
          }
        };

        const marker = map.addMarker(markerOptions)
          .then((marker: Marker) => {
            marker.showInfoWindow();
          });

      });
    })
  }
}

