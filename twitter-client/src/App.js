import React, { Component } from 'react';
import  { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';


import {Provider} from 'react-redux';
//import store from './redux/store';

// import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { ThemeProvider } from '@material-ui/styles';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode'

import Navbar from './Components/Navbar';
import AuthRoute from  './util/AuthRoute';

import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.TweetToken;
if(token) {
  console.log('in the hhh');
 const decodedToken = jwtDecode(token);
 console.log(decodedToken);
 if(decodedToken.exp * 100 < Date.now()){
   console.log('unhjjd')
   window.location.href = '/login';
   authenticated = false;
 }
 else {
   console.log(authenticated);
   authenticated = true;
 }
}
/*
/*
 <html>
            <AuthRoute exact path='/login' component={login} authenticated={authenticated}/>
           <AuthRoute exact path='/signup' component={signup} authenticated={authenticated}/>
 </html>
}*/

class App extends Component {
  render() {
  return (
    <ThemeProvider theme={theme}>
      {/* <Provider store={store}> */}
      <div className="App">
       <Router>
         <Navbar />
         <div className="container">
         <Switch>
           <Route exact path="/" component={home}/>
           {/* <Route exact path="/login" component={login}/>
           <Route exact path="/signup" component={signup}/> */}
           <AuthRoute exact path='/login' component={login} authenticated={authenticated}/>
           <AuthRoute exact path='/signup' component={signup} authenticated={authenticated}/>
         </Switch>
         </div>
       </Router>
    </div>
      {/* </Provider> */}
    </ThemeProvider>
  );
}
}

export default App;






// <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>