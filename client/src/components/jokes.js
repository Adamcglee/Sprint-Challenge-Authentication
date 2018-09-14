import React, { Component } from "react";
import axios from "axios";

class Jokes extends Component {
  state = {
    jokes: []
  };

  render() {
    return (
      <div>
        {this.state.jokes.map(joke => (
          <div>
            <h3 key={joke.id}>{joke.setup}</h3>
            <p key={joke.id}>{joke.punchline}</p>
          </div>
        ))}
      </div>
    );
  }

  componentDidMount() {
    const token = localStorage.getItem("jwt");
    const reqOptions = {
      headers: {
        Authorization: token
      }
    };
    axios
      .get("http://localhost3300/api/jokes", reqOptions)
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data });
      })
      .catch(err => {
        console.error("Axios Error:", err);
      });
  }
}

export default Jokes;
