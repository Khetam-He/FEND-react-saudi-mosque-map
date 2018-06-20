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
import Map from './Map'
import Sidebar from "./Sidebar";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            map: '',
            info: '',
            //includes all the markers info (latitudes ,longitude , name , website)
            markers: [{
                    lat: 21.423323,
                    long: 39.826399,
                    name: 'Al-Masjid Al Haram _ Macca',
                    website: 'https://en.wikipedia.org/wiki/Great_Mosque_of_Mecca'
                }, {
                    lat: 21.381667,
                    long: 39.874444,
                    name: 'Masjid Al-Rajhi _ Macca',
                    website: 'https://www.beautifulmosque.com/Al-Rajhi-Mosque-in-Mecca-Saudi-Arabia'
                }, {
                    lat: 24.467191,
                    long: 39.611099,
                    name: 'Al-Masjid al-Nabawi _Medina',
                    website: 'https://en.wikipedia.org/wiki/Al-Masjid_an-Nabawi'
                }, {
                    lat: 24.4367515863,
                    long: 39.616997532,
                    name: 'Quba Mosque _ Medina',
                    website: 'https://en.wikipedia.org/wiki/Quba_Mosque'

                }, {
                    lat: 24.706997172,
                    long: 46.721163782,
                    name: 'Imam Turki Bin Abdullah Grand Mosque _ Riyadh',
                    website: 'https://en.wikipedia.org/wiki/Imam_Turki_bin_Abdullah_Mosque'

                },
                {
                    lat: 21.6486985,
                    long: 39.1008551,
                    name: 'Al-Rahma Mosque _ Jeddah',
                    website: 'https://www.tripadvisor.com/ShowUserReviews-g295419-d319513-r328313591-Floating_Mosque-Jeddah_Makkah_Province.html'
                }, {
                    lat: 25.8449509,
                    long: 44.1979471,
                    name: 'Khubaib Bin Addey Mosque _ Qaseem',
                    website: 'https://en.wikipedia.org/wiki/Khubayb_ibn_Adiy'
                }


            ],
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


                    var info =
                        "<div id='marker'>" +
                        "<h2>" + self.marker.title + "</h2>" +
                        "<p><b>Address:</b> " + place.location.address + ", " + place.location.city + "</p>" +
                        "<p><b>website:</b> " +"<a target= \"_blank\" href=>"+self.marker.website+"</a>"+
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