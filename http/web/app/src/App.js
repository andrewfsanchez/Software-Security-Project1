import React from 'react';
import LogInPage from './Components/LogInPage'
import {Route} from 'react-router-dom'
import Register from './Components/RegisterForm'
import Login from './Components/LoginForm'
import Dashboard from './Components/Dashboard'
import Search from './Components/Search'
import './App.css';

class App extends React.Component {
  render() {
    return(
      <div>
        <Route exact path="/" component={LogInPage} />
        <Route exact path="/Login" component={Login} />
        <Route exact path="/Register" component={Register} />
        <Route exact path="/Dashboard" component={Dashboard} />
        <Route exact path="/Search" component={Search} />
      </div>
    );
  }
}

export default App;
