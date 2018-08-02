import * as React from 'react';
import { Interactive } from '../populations';
import PopulationsModel from './populations-model';
import TimelineView from './timeline-view';

const SEASONS = ["spring", "summer", "fall", "winter"];

interface IProps {
  hideModel?: boolean;
  simulationYear: number;
  simulationStepInYear: number;
  interactive?: Interactive;
  onSetInteractive: (interactive: Interactive) => void;
}

interface IState {}

export default class PopulationsModelPanel extends React.Component<IProps, IState> {

  state: IState = {
  };

  public render() {
    const { simulationYear, simulationStepInYear, interactive, onSetInteractive } = this.props,
          populationsModel = !this.props.hideModel
                              ? <PopulationsModel
                                  interactive={interactive}
                                  onSetInteractive={onSetInteractive} />
                              : null,
          // env = interactive && interactive.environment,
          seasonLengths = [200, 200, 200]; // env && env.seasonLengths;
    return (
      <div>
        <div id="color-controls" hidden={true}>
          % Brown: <input id="starting-brown" value={50} />
          % White: <input id="starting-white" value={50} />
        </div>
        <div id="genome-controls" hidden={true}>
          % BB: <input id="starting-BB" value={25} />
          % Bb: <input id="starting-Bb" value={25} />
          % bb: <input id="starting-bb" value={50} />
        </div>
        {populationsModel}
        <div id="env-controls">
          <div id="switch-controls" hidden={false}>
            <button id="switch-env">Switch Environments</button>
          </div>
          <div id="overlay-controls">
            <input id="view-sex-check" type="checkbox" />Show males and females
            <img className="overlay-icon" src={require("../images/overlays/male-female-stack.png")} />
            <input id="view-hetero-check" type="checkbox" />Show heterozygotes
            <img className="overlay-icon" src={require("../images/overlays/heterozygous-icon.png")} />
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
