import React from 'react';
import ReactDOM from 'react-dom';
import {images, prefix} from './images.json';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'cropperjs/dist/cropper.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App images={images.map((image) => `${prefix}${image}`)}/>, document.getElementById('root'));
registerServiceWorker();
