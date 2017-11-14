import React, {Component} from 'react';

export default class Breadcrumb extends Component {

	getCurrentStep() {
		const { step, finished } = this.props;
		if (finished) return null;
		return (
			<button className="btn btn-primary" style={{ opacity: 0.7 }}>{step + 1}</button>
		);
	}

	getPreviousSteps() {
		const { data } = this.props;
		return data.map(({ hasLogo }, index) => <button key={index} className={`btn ${hasLogo ? 'btn-success' : 'btn-danger'}`}>{index + 1}</button>)
	}

	getNextSteps() {
		const { finished, length, step } = this.props;
		if (finished || step === length - 1) return null;
		return Array.apply(null, new Array(length - step - 1)).map((_, index) => (
			<button key={index} className="btn btn-warning">{ step + 2 + index }</button>
		));
	}

	render () {
		return (
			<div className="breadcrumb">
				{this.getPreviousSteps()}
				{this.getCurrentStep()}
				{this.getNextSteps()}
			</div>
		);		

	}
}