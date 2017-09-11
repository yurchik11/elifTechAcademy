import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

var map, pointA, pointB, directionsDisplay, pointAtxt, pointBtxt;
var flag=0;
var markers = [];

function loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    ref.parentNode.insertBefore(script, ref);
}

function addMarker(location)
{
	var marker = new google.maps.Marker({
	 position: location,
	 map: map
 });
 markers.push(marker);
}

// Sets the map on all markers in the array.
 function setMapOnAll(map) {
	 for (var i = 0; i < markers.length; i++) {
		 markers[i].setMap(map);
	 }
 }

 // Removes the markers from the map, but keeps them in the array.
 function clearMarkers() {
	 setMapOnAll(null);
 }

 // Shows any markers currently in the array.
 function showMarkers() {
	 setMapOnAll(map);
 }

function onMapClick(lat, lon){
	   flag++;
		 console.log(flag);
		 if(flag==1)
		 {
		 var uluru = {lat: lat, lng: lon};
		 addMarker(uluru);
		axios.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true&language=uk&region=UA')
		.then(function(response)
	  {
		  document.getElementById('from').value = response.data.results["0"].formatted_address;
			pointAtxt=response.data.results["0"].formatted_address;
	  });
		pointA=new google.maps.LatLng(lat, lon);
		showMarkers();
	}
	if(flag==2)
	{
		var uluru = {lat: lat, lng: lon};
		addMarker(uluru);
	 axios.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&sensor=true&language=uk&region=UA')
	 .then(function(response)
	 {
		 document.getElementById('to').value = response.data.results["0"].formatted_address;
		 pointBtxt=response.data.results["0"].formatted_address;
	 });
	 pointB=new google.maps.LatLng(lat, lon);
	 showMarkers();
	}
	else if(flag==3) {
		clearMarkers();
		flag=0;
		markers=[];
		document.getElementById('from').value=null;
		document.getElementById('to').value=null;
		document.getElementById('resultQuery').value = null;
		if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
	}
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
        origin: pointA,
        destination: pointB,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

export default class MapPage extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			data: []
		}
	}

	componentWillMount(){
		//axios.get('/deliveries').then(response => this.setState({data: response.data}));
	}

	componentDidMount(){
		window.initMap = this.initMap;
    loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD-ndGVKy3lCnwzM2dKxp_pN9ePBDK2GL0&callback=initMap')
	}

	initMap(){
		var uluru = {lat: 49.83853, lng: 24.019643};
    map = new google.maps.Map(document.getElementById('map'), {
			zoom: 15,
			center: uluru
		});
		google.maps.event.addListener(map, 'click', function( event ){
       onMapClick(event.latLng.lat(),event.latLng.lng());
   });
	 }

	 createRoute(){
		 var directionsService = new google.maps.DirectionsService;
     directionsDisplay = new google.maps.DirectionsRenderer({map});
		 calculateAndDisplayRoute(directionsService,directionsDisplay,pointA,pointB);
		 var email= document.getElementById('email').value;
		 axios.get('cars?from='+pointAtxt+'&to='+pointBtxt+'&email='+email)
       .then(function (response) {
         console.log(response);
				 var date = new Date(response.data.data.beDeliveredDateFormat);
				 document.getElementById('resultQuery').value="Track: " + response.data.data.track + " ,\nApproxWillBeDelivered: "+date.toLocaleString();
       })
       .catch(function (error) {
         console.log(error);
       });
		 clearMarkers();
	 }

	render() {
		//var data = this.state.data;
		return (
			<div>
			 <div id="map"></div>
			 <form>
			 <div id="fromDiv" class='form-group'>
			 <label for='from'>From address: </label>
			 <input class="form-control" type="text" id="from"></input>
			 </div>
			 <div id='toDiv' class='form-group'>
			 <label for='to'>To address: </label>
			 <input class="form-control" type="text" id="to"></input>
			 </div>
			 <div id='emailDiv'>
			 <label for='email'>Your email: </label>
			 <input class="form-control"  type="email" id="email" value="user@gmail.com"></input>
			 </div>
			 <Button bsStyle="primary" onClick={this.createRoute}>Create Route</Button>
			 <div id='resDiv'>
			 <label for='resultQuery'>Result: </label>
			 <textarea class="form-control" rows="8" id="resultQuery"></textarea>
			 </div>
			 </form>
			</div>
		);
	}
}
