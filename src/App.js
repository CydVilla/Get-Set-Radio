import React, { Component } from "react";
// import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./components/Navigation";
import Signin from "./components/SignIn";
import Register from "./components/Register";
import Home from "./components/Home";

// import Logo from "./Logo/Logo";

// const particlesOptions = {
//   particles: {
//     number: {
//       value: 80,
//       density: {
//         enable: true,
//         value_area: 800,
//       }
//     }
//   }
// };

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, route } = this.state;
    return (
      <div className="App">
        {/* <Particles className="particles" params={particlesOptions} /> */}
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
               <Home
              onInputChange={this.onInputChange}
            />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;