import React from "react";
import Home from './Components/Home';
import Form from './Components/Form';
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './App.css';

const App = () => {
  return (
    <div className='app'>
      <Link to='/'>
        <div className='homeButton'>
          <button>Home</button>
        </div>
      </Link>
      <h1>Pizza Express</h1>
      <Route exact path='/'>
        <Home/>
      </Route>
      <Route path='/form'>
        <Form/>
      </Route>
    </div>
  );
};
export default App;
