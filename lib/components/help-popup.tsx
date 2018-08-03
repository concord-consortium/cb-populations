import * as React from 'react';
import '../style/help-popup.css';

interface IPopupState {
  helpVisible: boolean;
}
interface IProps {
  helpText: string;
}

class HelpPopup extends React.Component<IProps, IPopupState> {

  public state: IPopupState = {
    helpVisible: false
  };

  toggleHelp = () => {
    const visible = this.state.helpVisible;
    this.setState({ helpVisible: !visible });
  }

  public render() {
    const { helpVisible } = this.state;
    const { helpText } = this.props;
    const helpDisplayClass = helpVisible ? "help-container" : "help-container-hidden";
    return (
      <div className="help-popup">
        <div className="help-icon" onClick={this.toggleHelp} />
        {helpVisible &&
          <div className={helpDisplayClass} onClick={this.toggleHelp}>
            <div className="help-text">
            <div>{helpText}</div>
          </div>
        </div>
        }
      </div>
    );
  }
}

export default HelpPopup;