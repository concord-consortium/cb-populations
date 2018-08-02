import * as React from 'react';
import './style/App.css';
import {
  getCornStats, ISimulationState, kNullSimulationState, simulationStepsPerYear,
  addWormsSparse, addRandomSpiders, plantMixedCrop, prepareToEndYear, endYear
} from './corn-model';
import { Events, Environment, Interactive } from './populations';
import Attribution from './components/attribution';
import InitialDialog from './components/initial-dialog';
import EndSeasonDialog from './components/end-season-dialog';
import PlantingControls, { IPlayParams } from './components/planting-controls';
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
  isRunning: boolean;
  simulationState: ISimulationState;
  showInitialDialog: boolean;
  showEndSeasonDialog: boolean;
}

class App extends React.Component<IAppProps, IAppState> {

  simulationHistory: SimulationHistory;
  playParams?: IPlayParams;

  public state: IAppState = {
    isRunning: false,
    simulationState: kNullSimulationState,
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

    Events.addEventListener(Environment.EVENTS.STOP, (evt: any) => {
      this.handleSimulationStop();
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
    const { simulationStepInYear, simulationYear } = getCornStats();

    this.setState({ isRunning: true });

    if (simulationStepInYear === 0) {
      // plant the crop before proceeding
      plantMixedCrop(this.playParams ? this.playParams.cornPct : 100);
      // if this is the infestation year, then add rootworms
      if (simulationYear > 0) {
        const prevYear = this.simulationHistory.length - 1,
              prevYearStats = this.simulationHistory[prevYear];
        // worms infest after a full year without worms, which is
        // generally year 2 and any subsequent year after worms
        // have been eradicated for an entire year.
        if (prevYearStats && prevYearStats.initial && prevYearStats.final &&
            !prevYearStats.initial.countWorm && !prevYearStats.initial.countEggs &&
            !prevYearStats.final.countWorm && !prevYearStats.final.countEggs) {
          addWormsSparse();
        }
        // add spiders if requested
        if (this.playParams && this.playParams.addPredators) {
          addRandomSpiders(10);
        }
      }
      // retrieve post-change stats
      const simulationState = getCornStats();
      this.simulationHistory.push({ initial: simulationState });
      this.setState({ simulationState });
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

  handleSimulationStop() {
    this.setState({ isRunning: false });
  }

  handleSimulationReset() {
    this.simulationHistory = [];
    this.setState({ simulationState: kNullSimulationState });
  }

  handlePlayPauseClick = (params: IPlayParams) => {
    const { interactive } = this.state,
          environment = interactive && interactive.environment;
    if (environment) {
      if (this.state.isRunning) {
        environment.stop();
      }
      else {
        this.playParams = params;
        environment.start();
      }
    }
  }

  handleResetClick = () => {
    const { interactive } = this.state,
          environment = interactive && interactive.environment;
    if (environment) {
      environment.reset();
    }
  }

  // show the add predators button if the last full year
  // had rootworm eggs at the end of the season
  showSpidersOption() {
    const historyLength = this.simulationHistory.length;
    for (let i = historyLength - 1; i >= 0; --i) {
      const final = this.simulationHistory[i].final;
      if (final) {
        return final.countEggs > 0;
      }
    }
    return false;
  }

  public render() {
    const { interactive, simulationState,
            showInitialDialog, showEndSeasonDialog } = this.state,
          { simulationStepInYear, simulationYear } = simulationState,
          initialDialog = showInitialDialog
                            ? <InitialDialog
                                show={this.state.showInitialDialog}
                                onToggleVisibility={this.handleToggleInitialDialogVisibility} />
                            : null,
          historyLength = this.simulationHistory.length,
          chartSize = { width: 400, height: 145 },  // hard-coded for now
          cornChart = historyLength >= 1 && this.simulationHistory[0].final
                        ? <CornChart size={chartSize} simulationHistory={this.simulationHistory} />
                        : null,
          wormChart = historyLength >= 1 && this.simulationHistory[0].final
                        ? <WormChart size={chartSize} simulationHistory={this.simulationHistory} />
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
        </div>
        <Attribution />
        {initialDialog}
        {endSeasonDialog}
      </div>
    );
  }
}

export default App;
