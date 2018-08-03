import * as React from 'react';
import './style/App.css';
import { Events, Environment, Interactive } from './populations';
import Attribution from './components/attribution';
import PopulationsModelPanel from './components/PopulationsModelPanel/populations-model-panel';
import { urlParams } from './utilities/url-params';

interface IAppProps {
}

interface IAppState {
}

class App extends React.Component<IAppProps, IAppState> {
  public render() {
    return (
      <div className="app">
        <PopulationsModelPanel />
        <Attribution />
      </div>
    );
  }
}

export default App;
