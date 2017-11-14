import React, {PureComponent} from 'react';

export default class CropQuestionBox extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			confirm: false
		}
	}

	componentWillReceiveProps({ finished }) {
		if (finished) {
			this.setState({
				confirm: false 
			});
		}
	}

	confirmImage = () => {
		this.props.onConfirm();
		this.setState({
			confirm: true
		});
	};

	resetChoice = () => {
		this.props.onReset();
		this.setState({
			confirm: false
		});
	};

	render() {
		const { confirm } = this.state, {onDeny, onDone, storingDisabled, onResetAll, finished} = this.props;
		return (
			<div className="questionBox">
			<span>Is this the fully visible logo?</span>
			{ confirm && <div style={{ textAlign: 'center', padding: 5 }}>
					<span className="span-yes">YES</span>
					<div style={{ color: 'red', marginTop: 3 }}>Then place a bounding box around a logo</div>
				</div> }
			{ finished && <i className="check-mark fa fa-check"/> }
			{ confirm ? <div className="buttons">
					<button key="done" className="btn btn-primary" onClick={onDone} disabled={storingDisabled}>DONE</button>
					<button key="reset" className="btn btn-secondary" onClick={this.resetChoice}>RESET</button>
				</div> : finished ? <div className="buttons">
					<button className="btn btn-secondary" onClick={onResetAll}>RESET</button>
				</div> : 
				<div className="buttons">
					<button className="btn btn-success" onClick={this.confirmImage}>YES</button>
					<button className="btn btn-danger" onClick={onDeny}>NO</button>
				</div>
			}
			</div>
		);
	}
}