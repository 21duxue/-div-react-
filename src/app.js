import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';

function Loading() {
  return <div>Loading...</div>;
}

const PageMain = Loadable({
  loader: () => import('./components/pageMain'),
  loading: Loading,
});


const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={PageMain} />
    </div>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('app'));
