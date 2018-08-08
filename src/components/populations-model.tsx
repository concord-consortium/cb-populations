import '../style/App.css';
import * as React from 'react';
import { init } from '../corn-model';
import { Interactive } from '../populations';

interface IProps {}
interface IState {}

class PopulationsModel extends React.Component<IProps, IState> {
  public componentDidMount() {
    init();
  }

  public render() {
    return (
      <div id="environment" />
    );
  }
}

export default PopulationsModel;
