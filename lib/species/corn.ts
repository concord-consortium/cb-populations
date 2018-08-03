import { Agent, BasicPlant, Species, Trait } from '../populations';

const maturity = 300;

const lifestage = {
  seed: 0,
  shoot: 1,
  sprout: 2,
  young: 3,
  fullygrown: 4,
  mature: 5,
  flowering: 6,
  harvested: 7
};
const lifestageThresholds = {
  seed: 10,
  shoot: maturity * 0.2,
  sprout: maturity * 0.4,
  young: maturity * 0.6,
  fullygrown: maturity * 0.8,
  mature: maturity,
  flowering: maturity * 1.2,
  harvested: maturity * 2,
};

const getLifestage = (agent: Agent): number => {
  const age = agent.get('age');
  let stage = lifestage.seed;

  if (age < lifestageThresholds.shoot) {
    stage = lifestage.seed;
  }
  if (age >= lifestageThresholds.shoot && age < lifestageThresholds.sprout) {
    stage = lifestage.shoot;
  }
  if (age >= lifestageThresholds.sprout && age < lifestageThresholds.young) {
    stage = lifestage.sprout;
  }
  if (age >= lifestageThresholds.young && age < lifestageThresholds.fullygrown) {
    stage = lifestage.young;
  }
  if (age >= lifestageThresholds.fullygrown && age < lifestageThresholds.mature) {
    stage = lifestage.fullygrown;
  }
  if (age >= lifestageThresholds.mature && age < lifestageThresholds.flowering) {
    stage = lifestage.mature;
  }
  if (age >= lifestageThresholds.flowering && age < lifestageThresholds.harvested) {
    stage = lifestage.flowering;
  }
  if (age >= lifestageThresholds.harvested) {
    stage = lifestage.harvested;
  }
  return stage;
};

const healthTrait = new Trait({
  name: 'health',
  min: 0,
  max: 100,
  default: 100,
  float: false,
  mutatable: false
});

// degree to which rootworm prefers corn relative to
// other prey items (e.g. trap crop)
const wormPreference = new Trait({
  name: 'worm preference',
  min: 0,
  max: 100,
  default: 1,
  float: true,
  mutatable: false
});

// nutritional value of the corn to rootworm; multiplied by
// rootworm's consumption rate to determine energy gained
const wormNutrition = new Trait({
  name: 'worm nutrition',
  min: 0,
  max: 1,
  default: 1,
  float: true,
  mutatable: false
});

const healthyTolerance = 90;

const cornIsHealthy = (agent: Agent) => {
  return agent.get('health') >= healthyTolerance;
};

export const corn = new Species({
  speciesName: "Corn",
  agentClass: BasicPlant,
  defs: {
    CHANCE_OF_MUTATION: 0,
    SPROUT_AGE: 10,
    MATURITY_AGE: maturity
  },
  traits: [healthTrait, wormPreference, wormNutrition],
  imageRules: [
    {
      name: 'corn',
      rules: [
        {
          image: {
            path: require('../images/corn-0.png'),
            scale: 0.3,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return getLifestage(agent) === lifestage.seed;
          }
        },
        {
          image: {
            path: require('../images/corn-1.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return getLifestage(agent) === lifestage.shoot;
          }
        },
        {
          image: {
            path: require('../images/corn-2.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return getLifestage(agent) === lifestage.sprout;
          }
        },
        {
          image: {
            path: require('../images/corn-3.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (
              getLifestage(agent) === lifestage.young &&
              cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-3-sick.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (
              getLifestage(agent) === lifestage.young &&
              !cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-3.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (
              getLifestage(agent) === lifestage.fullygrown &&
              cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-3-sick.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (
              getLifestage(agent) === lifestage.fullygrown &&
              !cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-4.png'),
            scale: 0.25,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return ( getLifestage(agent) === lifestage.mature &&
              cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-2-sick.png'),
            scale: 0.3,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (getLifestage(agent) === lifestage.mature &&
              !cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-5.png'),
            scale: 0.25,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (getLifestage(agent) === lifestage.flowering
              && cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-5.png'),
            scale: 0.3,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (getLifestage(agent) === lifestage.flowering
              && cornIsHealthy(agent)
            );
          }
        },
        {
          image: {
            path: require('../images/corn-6.png'),
            scale: 0.3,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) {
            return (getLifestage(agent) === lifestage.harvested
              && cornIsHealthy(agent)
            );
          }
        },
      ]
    }
  ]
});
