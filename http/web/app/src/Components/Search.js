import React from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
        username: "",
        users: [{
        email : "",
        username : "",
        funds : 0
    }]
      
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


        /**
        * No error, then get the information from the database and continue from there
        * insert logic here
        * {'Authorization': 'Bearer <JWT>'}
        * 
        * if not in database, return alert
        */

        const user = {username: this.state.username};

        axios.post('http://localhost:5000/search', user).then(result => {
          console.log(result.data.access_token);
          this.setState({
              users : result.data.users
          })
        })
        .catch(error => {
          console.log(error);
          alert("Invalid account information. Please try again");
        });
  }
  

  render() {
    if(this.state.hasSubmitted) {
      return(
        <div>
            {this.state.users.map((user) => (
                <li>email: {user.email}, funds: {user.funds}</li>
            ))}
        </div>
      );
    }
    else {
      return(
        <div>
            <head>
                <title>Search</title>
                <link rel="shortcut icon" type="image/png" href="static/logo3.png"></link>
            </head>
            <center>
                <br /><br /><br />
                <h1>Search for existing users</h1>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                    <h4>Username: </h4>
                    <input type="text" value={this.state.username} name="username" id="username" onChange={this.handleChange}/>
                    <br /><br /><br />
                    <button>Login</button>
                </form>
            </center>
        </div>
      );
    }
  }
}

export default Search;