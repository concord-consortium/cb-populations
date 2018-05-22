import * as React from 'react';
import './style/App.css';
import {
  getCornStats, ISimulationState, kNullSimulationState, simulationStepsPerYear,
  addWormsSparse, plantMixedCrop, prepareToEndYear, endYear
} from './corn-model';
import { Events, Environment, Interactive } from './populations';
import Attribution from './components/attribution';
import InitialDialog from './components/initial-dialog';
import EndSeasonDialog from './components/end-season-dialog';
import PlantingControls from './components/planting-controls';
import PopulationsModelPanel from './components/populations-model-panel';
import SimulationStatistics from './components/simulation-statistics';
import { SimulationHistory } from './models/simulation-history';
import MultiTraitPanel from './components/multi-trait-panel';
import CornChart from './components/corn-chart';
import WormChart from './components/worm-chart';
import { urlParams } from './utilities/url-params';
const isInConfigurationMode = urlParams.config !== undefined;
const isInQuietMode = urlParams.quiet !== undefined;

interface IAppProps {
  hideModel?: boolean;
}

interface IAppState {
  interactive?: Interactive;
  simulationState: ISimulationState;
  cornPct: number;
  showInitialDialog: boolean;
  showEndSeasonDialog: boolean;
}

class App extends React.Component<IAppProps, IAppState> {

  simulationHistory: SimulationHistory;

  public state: IAppState = {
    simulationState: kNullSimulationState,
    cornPct: 100,
    showInitialDialog: !isInQuietMode,
    showEndSeasonDialog: false
  };

  constructor(props: IAppProps) {
    super(props);
    this.simulationHistory = [];
  }

  public componentDidMount() {

    Events.addEventListener(Environment.EVENTS.START, (evt: any) => {
      this.handleSimulationStart();
    });

    Events.addEventListener(Environment.EVENTS.STEP, (evt: any) => {
      this.handleSimulationStep();
    });

    Events.addEventListener(Environment.EVENTS.RESET, (evt: any) => {
      this.handleSimulationReset();
    });
  }

  handleSetInteractive = (interactive: Interactive) => {
    this.setState({ interactive });
  }

  handleToggleInitialDialogVisibility = () => {
    this.setState({ showInitialDialog: !this.state.showInitialDialog });
  }

  handleToggleEndSeasonDialogVisibility = () => {
    const showEndSeasonDialog = !this.state.showEndSeasonDialog;
    this.setState({ showEndSeasonDialog });
  }

  handleSimulationStart() {
    const { simulationStepInYear } = getCornStats();
    if (simulationStepInYear === 0) {
      // plant the crop before proceeding
      plantMixedCrop(this.state.cornPct);
      // retrieve post-planting stats
      const simulationState = getCornStats();
      this.simulationHistory.push({ initial: simulationState });
      this.setState({ simulationState });
      // if this is the infestation year, then add rootworms
      if (simulationState.simulationYear > 0) {
        const prevYear = this.simulationHistory.length - 2,
              prevYearStats = this.simulationHistory[prevYear];
        // worms infest after a full year without worms, which is
        // generally year 2 and any subsequent year after worms
        // have been eradicated for an entire year.
        if (!prevYearStats.initial.countWorm &&
            prevYearStats.final && !prevYearStats.final.countWorm) {
          addWormsSparse();
        }
      }
    }
  }

  handleSimulationStep() {
    const simulationState = getCornStats(),
          { simulationStepInYear, simulationYear } = simulationState;
    this.setState({ simulationState });
    // last step of the year
    if (simulationStepInYear === simulationStepsPerYear - 1) {
      // TODO: this is where we can do more to "harvest" corn, store end-of-year stats, etc.
      // Previously, end-of-year was handled as an environment rule, but this makes more sense since it
      // should only execute once per step.
      this.simulationHistory[simulationYear].final = simulationState;
      prepareToEndYear();
      // show the end of season stats before starting the next year
      this.setState({ showEndSeasonDialog: !isInQuietMode });
    }
    // stop at the end of the year before starting the new year
    else if (simulationStepInYear === 0) {
      endYear();
    }
  }

  handleSimulationReset() {
    this.simulationHistory = [];
    this.setState({ simulationState: kNullSimulationState });
  }

  onSetCornPct = (cornPct: number) => {
    this.setState({ cornPct });
  }

  public render() {
    const { interactive, simulationState, cornPct,
            showInitialDialog, showEndSeasonDialog } = this.state,
          { simulationStepInYear, simulationYear } = simulationState,
          initialDialog = showInitialDialog
                            ? <InitialDialog
                                show={this.state.showInitialDialog}
                                onToggleVisibility={this.handleToggleInitialDialogVisibility} />
                            : null,
          historyLength = this.simulationHistory.length,
          cornChart = historyLength >= 1 && this.simulationHistory[0].final
                        ? <CornChart simulationHistory={this.simulationHistory} />
                        : null,
          wormChart = historyLength >= 1 && this.simulationHistory[0].final
                        ? <WormChart simulationHistory={this.simulationHistory} />
                        : null,
          prevYear = historyLength >= 1 ? historyLength - 1 : 0,
          prevYearStats = this.simulationHistory[prevYear],
          endSeasonDialog = showEndSeasonDialog
                              ? <EndSeasonDialog
                                  show={this.state.showEndSeasonDialog}
                                  yearStats={prevYearStats}
                                  onToggleVisibility={this.handleToggleEndSeasonDialogVisibility} />
                              : null;
    
    return (
      <div className="app">
        <div className="simulation-and-control-panels">
          <div className="simulation-column">
            <PopulationsModelPanel hideModel={this.props.hideModel}
                                    simulationYear={simulationState.simulationYear}
                                    simulationStepInYear={simulationStepInYear}
                                    interactive={interactive}
                                    onSetInteractive={this.handleSetInteractive}/>
          </div>
          <div className="controls-column">
            <PlantingControls year={simulationYear + 1} cornPct={cornPct}
                              onSetCornPct={this.onSetCornPct}/>
            {isInConfigurationMode ? <MultiTraitPanel /> : null}
            {!isInConfigurationMode ? cornChart : null}
            {!isInConfigurationMode ? wormChart : null}
          </div>
        </div>
        <SimulationStatistics simulationState={simulationState} simulationHistory={this.simulationHistory}/>
        <Attribution />
        {initialDialog}
        {endSeasonDialog}
      </div>
    );
  }
}

export default App;
