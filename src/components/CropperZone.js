import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-cropper';
import CropQuestionBox from './CropQuestionBox';
import isEmpty from 'is-empty';

export default class CropperZone extends PureComponent {
	static propTypes = {
		image: PropTypes.string.isRequired
	};

	initialState = {
		absRatio: 1,
		width: 0,
		height: 0,
		left: 0,
		top: 0
	};

	constructor(props) {
		super(props);
		this.state = this.initialState;
	}

	componentWillReceiveProps({ finished }) {
		if (finished) {
			this.cropper.disable();
		}
	}

	adjustContainerSize(zoom) {
		const { naturalWidth: width, naturalHeight: height } = this.div.querySelector('img');
		const cropperContainer = this.div.querySelector('.cropper-container');
		this.div.style.width = cropperContainer.style.width = `${width * zoom}px`;
		this.div.style.height = cropperContainer.style.height = `${height * zoom}px`;
	}

	onReady = () => {
		this.adjustContainerSize(1);
		this.cropper.moveTo(0, 0);
		this.cropper.disable();
	}

	enableCrop = () => {
		this.cropper.enable();
	}

	resetCrop = () => {
		this.cropper.clear();
		this.cropper.zoomTo(1);
		this.cropper.moveTo(0, 0);
		this.cropper.disable();
		this.setState(this.initialState);
	};

	onCrop = () => {
		this.setState(this.cropper.getCropBoxData());
	};

	onZoom = event => {
		const { ratio, oldRatio } = event.detail;
		if (ratio > 2.5) {
			return event.preventDefault();
		}
		if (ratio < 1 && oldRatio >= 1) {
			event.preventDefault();
			return this.cropper.zoomTo(1);
		}
		this.storeCropBoxDataOnZoom(ratio/oldRatio, ratio); //store data before zooming
		setTimeout(() => { //this is horrible
			this.cropper.moveTo(0,0); //fix image position after zoom
			setTimeout(() => {
					this.setCropBoxDataAfterZoom(); //adjust cropBox position and dimensions for new zoom level (restore valid data)
					if(ratio/oldRatio < 1) {
						setTimeout(() => { //fixes image position for some cases where restoring cropBox moves image out of position
							this.cropper.moveTo(0, 0);
						}, 10);
					}
				}, 10);
		}, 10);
		this.adjustContainerSize(ratio);
	}

	storeCropBoxDataOnZoom(ratio, absRatio) {
		const cropper = this.cropper;
		if (!isEmpty(cropper.getCropBoxData())) {
			const { width, height, left, top } = cropper.getCropBoxData();
			this.setState({ 
				width: width * ratio, 
				height: height * ratio,
				left: left * ratio,
				top: top * ratio,
				absRatio 
			});
		}
	}

	setCropBoxDataAfterZoom() {
		const cropper = this.cropper;
		if (!isEmpty(cropper.getCropBoxData())) {
			const { left, top, width, height } = this.state;
			cropper.setCropBoxData({ width, height, left, top });
		}
	}

	storeImageData = () => {
		if (this.isStoringDisabled()) return;
		const { width, height, left, top, absRatio } = this.state;
		const imageData = {
			width: width / absRatio,
			height: height / absRatio,
			left: left / absRatio,
			top: top / absRatio
		};
		this.props.onStoreData(imageData);
	};

	rejectImage = () => {
		this.props.onStoreData();
	};

	isStoringDisabled = () => isEmpty(this.cropper && this.cropper.getCropBoxData());
	
	render () {
		const { image, onResetAll, finished } = this.props;
		return (
			<div ref={ref => this.div = ref} style={{ margin: 'auto', paddingTop: 65 }}>
				<Cropper key={image} ref={ref => this.cropper = ref} src={image} viewMode={2} 
								 highlight={false} scalable={false} rotatable={false} guides={false} center={false} autoCrop={false} 
								 ready={this.onReady} zoom={this.onZoom} cropend={this.onCrop} wheelZoomRatio={0.05}
								 toggleDragModeOnDblclick={false}/>
				<CropQuestionBox key={image+1} onConfirm={this.enableCrop} onDeny={this.rejectImage} 
								 onReset={this.resetCrop} onDone={this.storeImageData} storingDisabled={this.isStoringDisabled()}
								 onResetAll={onResetAll} finished={finished}/>
			</div>
			);
	}
}