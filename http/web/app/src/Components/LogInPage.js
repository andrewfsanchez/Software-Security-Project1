import React from 'react';
import {Link} from 'react-router-dom'

class LogInPage extends React.Component {  
  constructor() {
    super();
    this.state = {
      enableSecurity : false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {name, checked} = event.target;
      this.setState({
          [name] : checked
      })
  }

  render() {
    return(
      <center>
        <br /><br /><br />
        <h1>Welcome to your Bank Account</h1>
        <p>Please login or register to continue</p>
        <label>
          <input type="checkbox" name="enableSecurity" checked={this.state.enableSecurity} onChange={this.handleChange}/> Check this box to enable secure features
        </label>
        <br /><br /><br />
        <Link to={{pathname: "/Login", state: {enableSecurity: this.state.enableSecurity}}} className="button">Login</Link>
        <br /><br />
        <Link to={{pathname: "/Register", state: {enableSecurity: this.state.enableSecurity}}} className="button">Register</Link>
      </center>
    );
  }
}

export default LogInPage;