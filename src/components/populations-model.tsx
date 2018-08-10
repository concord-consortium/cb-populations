import '../style/App.css';
import * as React from 'react';
import { init, reset, patchPrototypes } from '../corn-model';
import { Interactive } from '../populations';
import { IModelConfig } from '../corn-model';

interface IProps {
  modelConfig?: IModelConfig;
}
interface IState {}

let hasPatched: boolean = false;
let model: any = null;

class PopulationsModel extends React.Component<IProps, IState> {
  public componentDidMount() {
    if (!hasPatched) {
      patchPrototypes(this.props.modelConfig);
      hasPatched = true;
    }
    model = init(this.props.modelConfig);
  }

  public componentWillReceiveProps(nextProps: IProps) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps)) {
      reset();
      model = init(nextProps.modelConfig);
    }
  }

  public componentWillUnmount() {
    reset();
  }

  public render() {
    return (
      <div id="environment" />
    );
  }
}

export default PopulationsModel;
