import React from 'react';
import {Redirect} from 'react-router-dom'
import axios from 'axios'

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
        username: "",
        hasSubmitted: false,
        users: [{
          email : "",
          username : "",
          funds : 0
        }]   
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  resetSearch(evemt) {
    this.setState({hasSubmitted: false});
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
              users : result.data.users, 
              hasSubmitted: true
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
            <h3>Search Results: </h3>
            {this.state.users.map((user) => (
                <li>email: {user.email}, funds: {user.funds}</li>
            ))}
            <button name="hasSubmitted" onClick={this.resetSearch}>Reset search</button>
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
                <br />
                <h3>Search for existing users</h3>
                <br></br>
                <form onSubmit={this.handleSubmit}>
                    <h4>Username: </h4>
                    <input type="text" value={this.state.username} name="username" id="username" onChange={this.handleChange}/>
                    <br /><br /><br />
                    <button>Search</button>
                </form>
            </center>
        </div>
      );
    }
  }
}

export default Search;