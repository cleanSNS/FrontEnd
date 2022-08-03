import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from "./routes/Home/HomeMain";
import Login from "./routes/Login/LoginMain";
import SocialLogin from "./routes/Login/SocialLogin";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/social">
          <SocialLogin />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;