import { Environment } from '../populations';

export default function() {
  return new Environment({
    columns: 90,
    rows: 45,
    imgPath: require('../images/environments/white_brown.png'),
    wrapEastWest: false,
    wrapNorthSouth: false,
    barriers: [[0, 100, 900, 50], [425, 0, 50, 450]]
  })
};