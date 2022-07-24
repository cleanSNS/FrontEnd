import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./routes/Home/HomeMain"
import Login from "./routes/Login/LoginMain"
import Members from "./footer/footer"

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <footer>
        <Members />
      </footer>
    </Router>
  );
}

export default App;