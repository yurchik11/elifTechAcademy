import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import MapPage from 'components/map';
import HomePage from 'components/home';
import TrackPage from 'components/track';
import EstimatePage from 'components/estimate';


const style = {
	content: {
		margin: 'auto',
		padding: '25px',
		width: '1200px',
		height: '800px',
		backgroundColor: 'rgb(244, 244, 244)'
	}
}

render(
		<div style={style.content}>
			<Router history={browserHistory}>
				<Route path="/" component={MapPage}>
					<IndexRoute component={MapPage} />
				</Route>
				<Route path='map' component={MapPage} />
				<Route path='track' component={TrackPage} />
				<Route path='estimate' component={EstimatePage} />
			</Router>
		</div>,
    document.getElementById('app')
);
