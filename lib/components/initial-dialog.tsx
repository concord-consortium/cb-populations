import * as React from 'react';
import '../style/dialog.css';

interface IProps {
  show: boolean;
  onToggleVisibility: () => void;
}

interface IState {
}

export default class InitialDialog extends React.Component<IProps, IState> {

  public state: IState = {
  };

  toggleVisibility = () => {
    this.props.onToggleVisibility();
  }

  public render() {
    const displayClass = this.props.show ? "" : " hidden";
    return (
      <div className={'dialog-container' + displayClass} onClick={this.toggleVisibility}>
        <div className="initial-dialog dialog-text">
          <div style={{ fontWeight: 'bold' }}>Help Jonah maximize his corn crop</div>
          <div>In the first year, plant 100% corn to see the maximum corn crop. The rootworm invasion occurs in the second year.</div>
          <div>Each year, examine the crop and rootworm data and set a planting plan to maximize the corn crop. Watch the trends to find the patterns in the data.</div>
        </div>
      </div>
   );
  }
}
