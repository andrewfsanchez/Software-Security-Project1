import React from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'

class RegisterForm extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email : "",
      username : "",
      password : "",
      funds : 0,
      isError : false,
      hasSubmitted : false,
      access_token: "",
      enableSecurity : props.location.state.enableSecurity
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
        else if(this.state.username === "") {
            this.setState({isError : true});
            alert("Invalid username...");
        }
        else if(this.state.password === "") {
            this.setState({isError : true});
            alert("Invalid password...");
        }
        else if(isNaN(this.state.funds) || this.state.funds <= 0) {
            this.setState({isError : true});
            alert("Invalid funds...");
        }
        else {
            /**
            * No error, then hand the information to database and continue from there
            * insert logic here
            */

            const user = {email: this.state.email, username: this.state.username, password: this.state.password, funds: this.state.funds};

            axios.post('http://localhost:5000/register', user).then(response => {
                this.setState({hasSubmitted : true, access_token : response.data.access_token});
                Cookies.set('access_token_cookie', `${response.data.access_token}`);
            })
            .catch(error => {
                console.log(error);
                alert("Account already exists. Please go to the login page");
            });
        }
    }
  
    render() {
        if(this.state.hasSubmitted) {
            return(
                <Redirect from="/" to={{pathname: "/Dashboard", state: { email: this.state.email, username: this.state.username, funds: this.state.funds, access_token: this.state.access_token, enableSecurity: this.state.enableSecurity}}} />
            );
        }
        else {
            return(
                <div>
                    <head>
                        <title>Create Account</title>
                        <link rel="shortcut icon" type="image/png" href="static/logo3.png"></link>
                    </head>
                    <center>
                        <br /><br /><br />
                        <h1>Create an Account</h1>
                        <br></br>
                        <form onSubmit={this.handleSubmit}>
                            <h4>Email: </h4>
                            <input type="text" value={this.state.email} name="email" id="email" onChange={this.handleChange} />
                            <h4>Username: </h4>
                            <input type="text" value={this.state.username} name="username" id="username" onChange={this.handleChange} />
                            <h4>Password: </h4>
                            <input type="password" value={this.state.password} name="password" id="password" onChange={this.handleChange} />
                            <h4>Funds: </h4>
                            <input type="text" value={this.state.funds} name="funds" id="funds" onChange={this.handleChange} />
                            <br /><br /><br />
                            <button>Create Account</button>
                        </form>
                    </center>
                </div>
            );
        }
    }
}

export default RegisterForm;