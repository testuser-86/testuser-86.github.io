import React, { Component } from 'react';
import CropperZone from './components/CropperZone';
import Breadcrumb from './components/Breadcrumb';

let imageData = [];

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			step: 0,
			finished: false
		};
	}

	storeStep = data => {
		const { step } = this.state, { images } = this.props;
		imageData.push({
			url: images[step],
			hasLogo: !!data,
			logoData: data
		});
		if (step + 1 === images.length) {
			this.setState({
				finished: true
			});
		} else {
			this.setState({
				step: step + 1
			});
		}
	};

	resetAll = () => {
		imageData = [];
		this.setState({ step: 0, finished: false });
	};

	submit = () => {
		console.log(imageData);
	};

	render() {
		const { images } = this.props, { step, finished } = this.state;
		return (
			<div className="App">
				<Breadcrumb {...this.state} data={imageData} length={images.length}/>
				<CropperZone image={images[step]} onStoreData={this.storeStep} finished={finished} onResetAll={this.resetAll}/>
				<div className="finished">
				{ finished && <button className="btn btn-primary btn-submit" onClick={this.submit}>Submit</button> }
			</div>
			</div>
		);
	}
}

export default App;
