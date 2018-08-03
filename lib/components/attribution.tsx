import * as React from 'react';
import { FlatIconAttribution } from '../images/flaticon/flaticon-attribution';
import '../style/attribution.css';

interface IAttributionState {
  attributionVisible: boolean;
}

class Attribution extends React.Component<{}, IAttributionState> {

  public state: IAttributionState = {
    attributionVisible: false
  };

  toggleAttribution = () => {
    const visible = this.state.attributionVisible;
    this.setState({ attributionVisible: !visible });
  }

  public render() {
    const { attributionVisible } = this.state;
    const attributionDisplayClass = attributionVisible ? "attribution-container" : "attribution-container-hidden";
    return ( <div className="attribution">
    <div className="attribution-logo" onClick={this.toggleAttribution} />
    <div className={attributionDisplayClass} onClick={this.toggleAttribution}>
      <div className="attribution-text">
        <div className="small-logo" onClick={this.toggleAttribution} />
        <div>This interactive was created by the Concord Consortium in collaboration with Indiana University and the Educational Testing Service.</div>
        <div>Copyright © 2018 The Concord Consortium. All rights reserved. The software is licensed under the MIT license. Please see <a href="https://github.com/concord-consortium/dat-cross-farm/blob/master/LICENSE" target="_blank" rel="noopener">license</a> for other software and associated licensing included in this product. Please provide attribution to the Concord Consortium and the URL <a href="https://concord.org" target="_blank" rel="noopener">https://concord.org</a>.</div>
        <FlatIconAttribution />
      </div>
    </div>
    </div>
   );
  }
}

export default Attribution;
