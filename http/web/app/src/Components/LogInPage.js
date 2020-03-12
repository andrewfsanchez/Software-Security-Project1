import React from 'react';
import {Link} from 'react-router-dom'

class LogInPage extends React.Component {  
  render() {
    return(
      <center>
        <br /><br /><br />
        <h1>Welcome to your Bank Account</h1>
        <p>Please login or register to continue</p>
        <br /><br />
        <Link to="/Login" className="button">Login</Link>
        <br /><br />
        <Link to="/Register" className="button">Register</Link>
      </center>
    );
  }
}

export default LogInPage;