import { Environment } from '../populations';

export default function() {
  return new Environment({
    columns: 45,
    rows: 45,
    imgPath: require('../images/environments/white.png'),
    wrapEastWest: false,
    wrapNorthSouth: false,
    barriers: [[0, 100, 500, 50]]
  })
};