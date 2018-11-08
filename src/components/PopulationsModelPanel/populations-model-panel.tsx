import * as React from 'react';
import PopulationsModel from '../populations-model';
import { IModelConfig } from '../../hawk-mice-model';

interface IProps {
  modelConfig?: IModelConfig;
}

interface IState {}

export default class PopulationsModelPanel extends React.Component<IProps, IState> {
  public render() {
    const populationsModel = <PopulationsModel modelConfig={this.props.modelConfig} />;
    return (
      <div id="model-panel">
        <div id="color-controls" hidden={true}>
          % Brown: <input id="starting-brown" value={50} />
          % White: <input id="starting-white" value={50} />
        </div>
        <div id="genome-controls" hidden={true}>
          % BB: <input id="starting-BB" value={25} />
          % Bb: <input id="starting-Bb" value={25} />
          % bb: <input id="starting-bb" value={50} />
        </div>
        <div id="hawks-controls" hidden={true}>
          Number of hawks:
          <input defaultValue="2" min="1" max="4" id="num-hawks" name="rangeslider" type="range" list="steplist" />
          <datalist id="steplist">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
          </datalist>
          <span id="num-hawks-text">2</span>
        </div>
        {populationsModel}
        <div id="env-controls">
          <div id="switch-controls" hidden={true}>
            <button id="switch-env">Switch Environments</button>
          </div>
          <div id="overlay-controls">
            <input id="view-sex-check" type="checkbox" />Show males and females
            <img className="overlay-icon" src={require("../../images/overlays/male-female-stack.png")} />
            <label id="view-hetero">
              <input id="view-hetero-check" type="checkbox" />
              Show heterozygotes
              <img className="overlay-icon" src={require("../../images/overlays/heterozygous-icon.png")} />
            </label>
          </div>
        </div>
        <div id="graph-controls">
          <button id="graph-colors">Graph Fur Color</button>
          <button id="graph-genotypes">Graph Genotypes</button>
          <button id="graph-alleles">Graph Alleles</button>
        </div>
        <div id="graphs" />
      </div>
    );
  }
}
