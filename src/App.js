//important files that will be used in the project
import React, {
    Component
}
from 'react';
import {
    Helmet
}
from 'react-helmet'
import './App.css';
import Markers from'./markers';
import Map from './Map'
import Sidebar from "./Sidebar";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
            //includes all the markers info (latitudes ,longitude , name , website)
            markers: Markers,
            virtualMarkers: []
        };

        //binding elements 
        this.initMap = this.initMap.bind(this);
        this.addMarkers = this.addMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }


    componentDidMount() {
            window.initMap = this.initMap;
            //add map api link with specific key 
            createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyDfQPpFKfgkuZ9ZDYmNy165S4IAZauv4K4&callback=initMap');
        }
        //initiating google map
    initMap() {
            let map;
            map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 7, //(specified the map zooming)
                center: {
                    lat: 23.422510,
                    lng: 41.826168
                } //(specified the map center)
            });

            var infowindow = new window.google.maps.InfoWindow({});

            this.setState({
                map: map,
                info: infowindow
            });
            this.addMarkers(map);
        }
        //create marker element
    addMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            const latLong = {
                lat: marker.lat,
                lng: marker.long
            }

            let mark = new window.google.maps.Marker({
                position: latLong,
                map: map,
                title: marker.name,
                website: marker.website

            });


            mark.addListener('click', function() {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({
                virtualMarkers: virtMarker
            });
        });
    }

    openMarker(marker = '') {
        const clientId = "VVPEFJC40SJDVH1YFRJS4IBNQ0GGZJY5X1XLHEA23H1LTVOQ\n";
        const clientSecret = "MEAM2N42L434P1MB1AJZFUHM5XAGMCDNGETUH5XNZIYEHOKI\n";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";


        if (this.state.info.marker != marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
            if (marker.getAnimation() != null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
            }




            this.state.info.addListener('closeClick', function() {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then(function(response) {
                if (response.status !== 200) {
                    const err = "Can't load page";
                    this.state.info.setContent(err);
                }
                response.json().then(function(data) {
                    var place = data.response.venues[0];
                      var web=self.marker.website;


                    var info =
                        "<div id='marker'>" +
                        "<h2>" + self.marker.title + "</h2>" +
                        "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        `<p><b>website:</b><a target= \"_blank\" href= ${web} > ${web}</a></p>`+
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function(err) {
                const error = "Can't load data.";
                self.setContent(error);
            });

    }


    render() {
        return (


            < div >
            < div >
            < Helmet >
            < title > Saudi Mosques < /title> < /Helmet> < /div> < header >
            < Sidebar infoWindow = {
                this.state.info
            }
            openInfo = {
                this.openMarker
            }
            virtualMarker = {
                this.state.virtualMarkers
            } >

            < /Sidebar> < h1 id = "title" > Saudi Famous Mosques < /h1> < /header> < Map markers = {
                this.state.markers
            } > < /Map> < /div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');

    script.src = url;
    script.async = true;
    script.onerror = function() {
        document.write("Google Maps can't be loaded");
    };
    tag.parentNode.insertBefore(script, tag);
}

export default App;