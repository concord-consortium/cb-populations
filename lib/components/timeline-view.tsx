import * as React from 'react';
import TimelineBar from './timeline-bar';
import '../style/timeline-view.css';

interface IProps extends ISizeMeProps {
  seasons?: string[];
  seasonLengths?: number[];
  simulationYear: number;
  simulationStepInYear: number;
}

interface IState {}

export default class TimelineView extends React.Component<IProps, IState> {

  state: IState = {
  };

  render() {
    const { seasons, seasonLengths, simulationYear, simulationStepInYear } = this.props,
          yearLabel = `Year ${simulationYear + 1}`;
    return (
      <div className="timeline-view">
        <span className='year-label'>{yearLabel}</span>
        <TimelineBar seasons={seasons}
                    seasonLengths={seasonLengths}
                    simulationStepInYear={simulationStepInYear} />
      </div>
    );
  }
}
