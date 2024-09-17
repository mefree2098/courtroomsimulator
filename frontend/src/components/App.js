// src/components/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import CaseGeneration from './CaseGeneration';
import PreTrial from './PreTrial';
import Trial from './Trial';
import CaseSummary from './CaseSummary';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/case/generate" component={CaseGeneration} />
        <PrivateRoute path="/case/pretrial/:caseId" component={PreTrial} />
        <PrivateRoute path="/case/trial/:caseId" component={Trial} />
        <PrivateRoute path="/case/summary" component={CaseSummary} />
        <Route path="/" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
