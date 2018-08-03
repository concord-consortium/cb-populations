import { Agent, BasicAnimal, Species, Trait } from '../populations';

const maturity = 1;

const eggTraits = [
  new Trait({
    name: 'hatched',
    default: false
  }),
  new Trait({
    name: 'default speed',
    default: 0
  }),
  new Trait({
    name: 'hatch variance',
    default: 0
  })

];

class WormEgg extends BasicAnimal {
  constructor(args: any) {
    super(args);
    this.set('speed', 0);
    this.set('hatch variance', Math.floor(Math.random() * 10));
  }
  _setSpeedAppropriateForAge() {
    // override / ignore base functionality - no speed for eggs
    return;
  }
  getSize() {
    // no growing over time
    return 1;
  }
  step() {
    // stop agent from moving, growing, doing anything each step.
    return;
  }
}

export const wormEgg = new Species({
  speciesName: "WormEgg",
  agentClass: WormEgg,
  defs: {
    CHANCE_OF_MUTATION: 0,
    MATURITY_AGE: maturity
  },
  traits: eggTraits,
  imageProperties:
    {
      rotate: false,
    },
  imageRules: [
    {
      name: 'wormEgg',
      rules: [
        {
          image: {
            path: require('../images/rootworm-larva1.png'),
            scale: 0.2,
            anchor: {
              x: 0.5,
              y: 0.5
            }
          },
          useIf(agent: Agent) {
            return true;
          }
        }]
    }]
  });