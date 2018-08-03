import * as React from 'react';

export const FlatIconAttribution: React.SFC<{}> = () => {
  const smashIconsLink = <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons" target="_blank" rel="noopener">Smashicons</a>,
        flatIconLink = <a href="https://www.flaticon.com/" title="Flaticon" target="_blank" rel="noopener">www.flaticon.com</a>,
        creativeCommonsLink = <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank" rel="noopener">CC BY 3.0</a>;
  return (
    <div>Icons by {smashIconsLink} from {flatIconLink} ({creativeCommonsLink} licensed).</div>
  );
};
