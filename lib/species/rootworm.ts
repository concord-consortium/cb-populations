import { Agent, AgentDistance, BasicAnimal, Species, Trait } from '../populations';

const maturity = 250;

export const wormLifestage = {
  egg: 0,
  larva: 1,
  grub: 2,
  adult: 3,
  mature: 4
};
const wormLifestageThresholds = {
  larva: 1,
  grub: maturity * 0.25,
  adult: maturity * 0.5,
  mature: maturity,
};
const wormScale = {
  egg: 0.2,
  larva: 0.2,
  grub: 0.2,
  adult: 0.25,
  mature: 0.1
};

export const getWormLifestage = (agent: Agent): number => {
  const age = agent.get('age');
  let stage = wormLifestage.egg;

  if (age < wormLifestageThresholds.larva) {
    stage = wormLifestage.egg;
  }
  if (age >= wormLifestageThresholds.larva && age < wormLifestageThresholds.grub) {
    stage = wormLifestage.larva;
  }
  if (age >= wormLifestageThresholds.grub && age < wormLifestageThresholds.adult) {
    stage = wormLifestage.grub;
  }
  if (age >= wormLifestageThresholds.adult && age < wormLifestageThresholds.mature) {
    stage = wormLifestage.adult;
  }
  if (age >= wormLifestageThresholds.mature) {
    stage = wormLifestage.mature;
  }
  return stage;
};

interface IPrey { name: string; preference?: number; }

export let wormTraits: Trait[] =
  [
    new Trait({
      name: 'default speed',
      default: 20
    }), new Trait({
      name: 'larva max speed',
      default: 0.5
    }), new Trait({
      // Prey attraction = distance / preference, so a value of one
      // (the default) leaves distance unchanged, but values > 1
      // make the agent more attractive by effecticely shrinking the
      // distance to the agent, while values < 1 make it less attractive
      // by effectively increasing the distance to the prey.
      name: 'prey', "default": [{ name: 'Corn', preference: 1 },
                                { name: 'Trap', preference: 20 }]
    }), new Trait({
      name: 'vision distance',
      default: 60
    }), new Trait({
      name: 'vision distance adult',
      default: 120
    }), new Trait({
      name: 'eating distance',
      default: 5
    }), new Trait({
      name: 'mating distance',
      default: 1
    }), new Trait({
      name: 'has mated',
      default: false
    }), new Trait({
      name: 'max offspring',
      default: 3
    }), new Trait({
      name: 'offspring',
      default: 0
    }), new Trait({
      name: 'resource consumption rate',
      default: 5
    }), new Trait({
      name: 'metabolism',
      default: 0.2
    }), new Trait({
      name: 'wings',
      default: 0
    }), new Trait({
      name: 'energy',
      default: 100
    }), new Trait({
      name: 'wandering threshold',
      default: 0
    }), new Trait({
      name: 'hunger bonus',
      default: 15
    }), new Trait({
      name: 'egg lay variance',
      default: 0
    }), new Trait({
      name: 'has laid eggs',
      default: false
    }), new Trait({
      name: 'egg lay energy threshold',
      default: 80
    })
  ];

class WormAnimal extends BasicAnimal {
  constructor(args: any) {
    super(args);
    this.set('maturity age', maturity);
    this.set('egg lay variance', Math.floor(Math.random() * 10));
  }
  step() {
    super.step();
    if (this.get('age') === maturity) {
      this.set('speed', this.get('default speed'));
      this.set('vision distance', this.get('vision distance adult'));
    }
  }

  getSize() {
    // Normally populations.js will smoothly grow the organism from invisible infant (0) to maturity (1), but
    // since worms hatch from eggs we need our worms to grow from small to mature
    const sizeScale = this.get('age') / maturity;
    if (sizeScale < 1) {
      return Math.max(0.5, sizeScale);
    } else {
      return 1;
    }
  }

  eat() {
    const nearest = this._nearestPrey();
    if (nearest) {
      const eatingDist = this.get('eating distance');
      if (nearest.distanceSq < Math.pow(eatingDist, 2)) {
        // we're close enough, eat prey
        this._eatPrey(nearest.agent);
      }
      else {
        // move to prey
        this.chase(nearest);
      }
    }
    else {
      this.wander(this.get('default speed'));
    }
  }

  _eatPrey(prey: Agent) {
    const consumptionRate = this.get('resource consumption rate');
    const nutritionFactor = prey.get('worm nutrition');
    const deltaEnergy = nutritionFactor != null
                          ? nutritionFactor * consumptionRate
                          : 1;
    const currEnergy = this.get('energy');

    this.set('energy', currEnergy + deltaEnergy);

    const preyHealth = prey.get('health');
    const newHealth = preyHealth - consumptionRate;
    if (newHealth > 10) {
      prey.set('health', preyHealth - consumptionRate);
    }
    else {
      prey.die();
    }
  }
  wander(speed: number) {
    super.wander(speed);
    if (this.get('age') > maturity) {
      this.set('wings', 1);
    }
  }
  chase(nearestAgent: any) {
    super.chase(nearestAgent);
  }
  move(speed: number) {
    // energy currently used as a health-meter for bugs
    const currEnergy = this.get('energy');

    if (currEnergy === 0) {
      this.die();
    }
    if (this.get('current behavior') !== 'eating') {
      if (this.get('age') < maturity) {
        // larva can't move fast
        speed = speed > this.get('larva max speed') ? this.get('larva max speed') : speed;
      } else {
        // adults that fly will use up energy more quickly
        this.set('energy', currEnergy - (speed * 0.5));
      }
      super.move(speed);
    } else {
      // we're eating, move slowly
      super.move(speed * 0.01);
    }
  }
  _nearestPrey(): AgentDistance | null {
    const prey: IPrey[] = this.get('prey');
    if (prey && prey.length) {
      const nearest = this._nearestAgentsMatching({ types: prey, quantity: 100 });
      nearest.forEach((a) => {
        // determine preference for this prey
        const preyPreference = a.agent.get('worm preference') || 1;
        // adjust distance based on preference
        a.distanceSq /= preyPreference;
      });
      // sort by preference-adjusted distance
      nearest.sort((a, b) => a.distanceSq - b.distanceSq);
      // for now, return the most-preferred prey
      return nearest[0] || null;
    }
    return null;
  }
}

export const worm = new Species({
  speciesName: "Worm",
  agentClass: WormAnimal,
  defs: {
    CHANCE_OF_MUTATION: 0
  },
  traits: wormTraits,
  imageProperties:
    {
      rotate: true,
      initialRotationDirection: -Math.PI
    },
  imageRules: [
    {
      name: 'worm',
      rules: [
        {
          image: {
            path: require('../images/rootworm-larva2.png'),
            scale: wormScale.egg,
            anchor: {
              x: 0.5,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return getWormLifestage(agent) === wormLifestage.egg;
          }
        },
        {
          image: {
            path: require('../images/rootworm-larva2.png'),
            scale: wormScale.larva,
            anchor: {
              x: 0.5,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return getWormLifestage(agent) === wormLifestage.larva;
          }
        },
        {
          image: {
            path: require('../images/rootworm-larva2.png'),
            scale: wormScale.grub,
            anchor: {
              x: 0.5,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return getWormLifestage(agent) === wormLifestage.grub;
          }
        },
        {
          image: {
            path: require('../images/rootworm-larva2.png'),
            scale: wormScale.adult,
            anchor: {
              x: 0.5,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return getWormLifestage(agent) === wormLifestage.adult;
          }
        },
        {
          image: {
            path: require('../images/rootworm-mature.png'),
            scale: wormScale.mature,
            anchor: {
              x: 0.4,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return getWormLifestage(agent) === wormLifestage.mature;
          }
        }
      ]
    }
  ]
});
