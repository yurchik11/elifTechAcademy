import React from 'react';
import axios from 'axios';

export default class HomePage extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			data: []
		}
	}

	componentWillMount(){
		axios.get('/deliveries').then(response => this.setState({data: response.data}));
	}

	render() {
		var data = this.state.data;
		return (
			<div>
			{data.map(item =>
				  <h2>{item.origin}, {item.departure}, {item.timeDelivery}, {item.distanceDelivery}, {item.status},</h2>
				)};
			</div>
		);
	}
}
