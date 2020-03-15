import React from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      email : "",
      username : "From database",
      password : "",
      funds : 9999999,
      isError : false,
      hasSubmitted : false,
      res : {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      const {name, value} = event.target;
      this.setState({
          [name] : value
      })
  }

  handleSubmit(event) {
    /**
    * Process the entered information for the account
    * Should check all the fields have appropriate stuff
    * Basic checks below
    */

    event.preventDefault();

    if(this.state.email === "" || !this.state.email.includes("@")) {
        this.setState({isError : true});
        alert("Invalid email...");
    }
    else if(this.state.password === "") {
        this.setState({isError : true});
        alert("Invalid password...");
    }
    else {
        /**
        * No error, then get the information from the database and continue from there
        * insert logic here
        * 
        * if not in database, return alert
        */

        const user = {email: this.state.email, password: this.state.password};

        axios.post('http://localhost:5000/login', user).then(result => {
          console.log(result);
          this.setState({hasSubmitted : true});
        })
        .catch(error => {
          console.log(error);
          alert("Invalid account information. Please try again");
        });
    }
  }
  
  render() {
    if(this.state.hasSubmitted) {
      return(
        <Redirect from="/" to={{pathname: "/Dashboard", state: { email: this.state.email, username: this.state.username, funds: this.state.funds}}} />

      );
    }
    else {
      return(
        <div>
            <head>
                <title>Login</title>
                <link rel="shortcut icon" type="image/png" href="static/logo3.png"></link>
            </head>
            <center>
                <br /><br /><br />
                <h1>Login to your Account</h1>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                    <h4>Email: </h4>
                    <input type="text" value={this.state.email} name="email" id="email" onChange={this.handleChange} />
                    <h4>Password: </h4>
                    <input type="password" value={this.state.password} name="password" id="password" onChange={this.handleChange} />
                    <br /><br /><br />
                    <button>Login</button>
                </form>
            </center>
        </div>
      );
    }
  }
}

export default LoginForm;