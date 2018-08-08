import '../style/App.css';
import * as React from 'react';
import { init } from '../corn-model';
import { Interactive } from '../populations';
import { IModelConfig } from '../corn-model';

interface IProps {
  modelConfig?: IModelConfig;
}
interface IState {}

class PopulationsModel extends React.Component<IProps, IState> {
  public componentDidMount() {
    init(this.props.modelConfig);
  }

  public render() {
    return (
      <div id="environment" />
    );
  }
}

export default PopulationsModel;
