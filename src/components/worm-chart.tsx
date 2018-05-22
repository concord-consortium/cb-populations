import * as React from 'react';
// import * as sizeMe from 'react-sizeme';
import { SimulationHistory } from '../models/simulation-history';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

interface IProps extends ISizeMeProps {
  simulationHistory: SimulationHistory;
}

interface IState {}

export default class WormChart extends React.Component<IProps, IState> {

  state: IState = {
  };

  render() {
    const { simulationHistory } = this.props,
          // width = size && size.width || 0,
          // height = size && size.height || 0,
          filtered = simulationHistory.filter((x) => x.initial && x.final),
          // show last five years
          cropped = filtered.filter((x, i) => i >= filtered.length - 5),
          wormData = cropped.map((x) => ({
                      year: `Year ${x.initial.simulationYear + 1}`,
                      initial: x.initial.countEggs,
                      final: x.final && x.final.countEggs
                    }));
    return (
    	<BarChart width={300} height={180} data={wormData} barGap={0}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <CartesianGrid strokeDasharray="3 3"/>
       <XAxis dataKey="year"/>
       <YAxis label={{ value: 'Rootworm Eggs', angle: -90, position: 'insideBottomLeft' } as any}/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="initial" fill="#8884d8" />
       <Bar dataKey="final" fill="#82ca9d" />
      </BarChart>
    );
  }
}

// const sizeMeConfig = { monitorWidth: true, monitorHeight: true, noPlaceholder: true };
// export default sizeMe(sizeMeConfig)(CornChart as any);