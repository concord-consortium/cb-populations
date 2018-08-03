import { Agent, BasicPlant, Species, Trait } from '../populations';

const kPlantScale = 0.1;
const kFlowerAnchorX = 0;
const kFlowerAnchorY = -30;

const healthTrait = new Trait({
  name: 'health',
  min: 0,
  max: 100,
  default: 100,
  float: false,
  mutatable: false
});

// degree to which rootworm prefers this relative to other prey items (e.g. corn)
// squared distance is divided by this when determining preference, so a value
// of four makes it equal in preference to prey with a value of 1 at half the distance.
const wormPreference = new Trait({
  name: 'worm preference',
  min: 0,
  max: 100,
  default: 20,  // substantially preferred
  float: true,
  mutatable: false
});

// nutritional value of the corn to rootworm; multiplied by
// rootworm's consumption rate to determine energy gained
const wormNutrition = new Trait({
  name: 'worm nutrition',
  min: 0,
  max: 1,
  default: 0.2, // substantially less nutritional value
  float: true,
  mutatable: false
});

export const variedPlants = new Species({
  speciesName: "Trap",
  agentClass: BasicPlant,
  defs: {
    MAX_AGE: 10000,
    MAX_HEALTH: 1,
    SPROUT_AGE: 50,
    MATURITY_AGE: 200,
    CAN_SEED: true,
    IS_ANNUAL: true,
    CHANCE_OF_SEEDING: 0.6,
    CHANCE_OF_MUTATION: 0.2,
    INFO_VIEW_PROPERTIES: {
      "Leaf Size: ": 'size',
      "Root Size: ": 'root size'
    }
  },
  traits: [
    healthTrait, wormPreference, wormNutrition,
    new Trait({ name: "size", min: 1, max: 10, mutatable: true }),
    new Trait({ name: "root size", min: 1, max: 10, mutatable: true })
  ],
  imageRules: [
    {
      name: 'plant',
      contexts: ['environment', 'info-tool', 'carry-tool'],
      rules: [
        {
          image: {
            path: require('../images/varied-plants/seed.png')
          },
          useIf(agent: Agent) { return agent.get('age') < agent.species.defs.SPROUT_AGE; }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves10.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 1) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted10.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 1) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves9.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 2) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted9.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 2) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves8.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 3) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted8.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 3) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves7.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 4) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted7.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 4) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves6.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 5) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted6.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 5) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves5.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 6) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted5.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 6) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves4.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 7) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted4.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 7) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves3.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 8) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted3.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 8) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves2.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 9) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted2.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 9) && (agent.get('health') <= 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves1.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 10) && (agent.get('health') > 0.99); }
        },
        {
          image: {
            path: require('../images/varied-plants/leaves_wilted1.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 1
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 10) && (agent.get('health') <= 0.99); }
        }
      ]
    },
    {
      name: 'roots',
      contexts: ['info-tool', 'carry-tool'],
      rules: [
        {
          image: {
            path: require('../images/varied-plants/roots10.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 10); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots9.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 9); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots5.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 5); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots8.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 8); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots7.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 7); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots6.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 6); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots5.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 5); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots4.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 4); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots3.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 3); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots2.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 2); }
        },
        {
          image: {
            path: require('../images/varied-plants/roots1.png'),
            scale: kPlantScale,
            anchor: {
              x: 0.5,
              y: 0
            },
            position: {
              y: -2
            }
          },
          useIf(agent: Agent) { return (agent.get('age') >= agent.species.defs.SPROUT_AGE) && (agent.get('root size') === 1); }
        }
      ]
    },
    {
      name: "flower",
      contexts: ['environment', 'info-tool', 'carry-tool'],
      rules: [
        {
          image: {
            path: require('../images/varied-plants/flower1.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 10) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower2.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 9) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower3.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 8) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower4.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 7) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower5.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 6) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower6.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 5) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower7.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 4) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower8.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 3) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower9.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 2) && agent.get('has flowers'); }
        },
        {
          image: {
            path: require('../images/varied-plants/flower10.png'),
            scale: kPlantScale,
            position: {
              x: kFlowerAnchorX,
              y: kFlowerAnchorY
            }
          },
          useIf(agent: Agent) { return (agent.get('size') === 1) && agent.get('has flowers'); }
        }
      ]
    }
  ]
});
