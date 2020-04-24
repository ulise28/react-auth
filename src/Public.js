import React, { Component } from "react";

class Public extends Component {
  state = {
    message: "",
  };
  componentDidMount() {
    fetch("/public")
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("API response resulted in error");
      })
      .then((response) => this.setState({ message: response.message }))
      .catch((error) => this.setState({ message: error }));
  }
  render() {
    return <div>{this.state.message}</div>;
  }
}

export default Public;
