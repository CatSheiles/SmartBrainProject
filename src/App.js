import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'ba86138515564a14ada98af031fbe4de'
});

/* you can change value and value_area numbers below to adjust particle density*/
const particlesOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
}

class App extends Component {
  /*defining a constructor so that detect input box registers user input*/
  constructor () {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
      /*building a route which keeps track of where you are on a page*/
      route: 'signin',
      isSignedIn: false
    }
  }

    calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      /*inserting bounding box around face calculate 4 points of box*/
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayFaceBox = (box) => {
      console.log(box);
      this.setState({box: box});
    }


    onInputChange = (event) => {
      this.setState({input: event.target.value});
      /*oninputChange pass it to imagelinkform*/
    }

    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then(response => this.displayFaceBox(this.calculateFaceLocation(response))
        .catch(err => console.log(err)));
    }

  /*Signin page route changes*/
   onRouteChange = (route) => {
     if (route === 'signout') {
       this.setState({isSignedIn: false})
     } else if (route === 'home') {
       this.setState({isSignedIn: true})
     }
     this.setState({route: route});
   }
  
  render(){
     return (
      <div className="App">
        <Particles className='particles' 
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          : (
            this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )
          }
      </div>
     );
  }
}
    
export default App;
