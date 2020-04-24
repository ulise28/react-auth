import React, { Component } from "react";

class Callback extends Component {
  componentDidMount() {
    //handle auth
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("Invalid callback url.");
    }
  }
  render() {
    return <h2>Loading...</h2>;
  }
}

export default Callback;
