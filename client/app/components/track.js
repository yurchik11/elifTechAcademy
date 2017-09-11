import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';


export default class TrackPage extends React.Component {
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

	}

  getDeliviveryByTrack(){
    axios.get('/deliveries/'+document.getElementById('trackInput').value)
    .then(function(response)
    {
			console.log(response);
      document.getElementById('fromTrack').value = response.data.from;
      document.getElementById('toTrack').value = response.data.to;
      document.getElementById('timeDelTrack').value = response.data.timeDelivery;
      document.getElementById('distDelTrack').value = response.data.distanceDelivery;
      var date = new Date(response.data.beDeliveredDateFormat);
      document.getElementById('beDelTrack').value = date.toLocaleString();
      document.getElementById('statusTrack').value = response.data.status;
    })
    .catch(function(error)
    {
      document.getElementById('fromTrack').value = "Error: " + response.data.error;
    });
  }

І
	render() {
		//var data = this.state.data;
		return (
			<div>
			 <form>
			 <div id="trackCode" class='form-group'>
			 <label for='trackInput'>Enter your track code: </label>
			 <input class="form-control" type="text" id="trackInput"></input>
       <Button bsStyle="warning" id="getInfoBtn" onClick={this.getDeliviveryByTrack}>Get Info</Button>
       </div>
			 </form>
       <form>
			 <div id="resultTrack" class='form-group'>
       <h2>Result</h2>
			 <label for='fromTrack'>From: </label>
			 <input class="form-control" type="text" id="fromTrack"></input>
       <label for='toTrack'>To: </label>
			 <input class="form-control" type="text" id="toTrack"></input>
       <label for='timeDelTrack'>Time delivery: </label>
			 <input class="form-control" type="text" id="timeDelTrack"></input>
       <label for='distDelTrack'>Distance delivery: </label>
			 <input class="form-control" type="text" id="distDelTrack"></input>
       <label for='beDelTrack'>Be delivered: </label>
			 <input class="form-control" type="text" id="beDelTrack"></input>
       <label for='statusTrack'>Status: </label>
			 <input class="form-control" type="text" id="statusTrack"></input>
       </div>
			 </form>
			</div>
		);
	}
}
