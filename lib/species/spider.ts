import { Agent, BasicAnimal, Species, Trait } from '../populations';

const maturity = 1;

const traits = [
  new Trait({ name: 'default speed', default: 0.5 }),
  new Trait({ name: 'speed', default: 0.5 }),
  new Trait({ name: 'prey', default: [{name: 'Worm'}], }),
  new Trait({ name: 'vision distance', default: 50 }),
  new Trait({ name: 'eating distance', default:  5 }),
  new Trait({ name: 'mating distance', default:  5 }),
  new Trait({ name: 'max offspring',   default:  2 }),
  new Trait({ name: 'resource consumption rate', default:  10 }),
  new Trait({ name: 'metabolism', default:  1 })
];

class Spider extends BasicAnimal {
}

export const spider = new Species({
  speciesName: "Spider",
  agentClass: Spider,
  defs: {
    CHANCE_OF_MUTATION: 0,
    MATURITY_AGE: maturity
  },
  traits,
  imageProperties:
    {
      rotate: true,
      initialRotationDirection: Math.PI / 2
    },
  imageRules: [
    {
      name: 'spider',
      rules: [
        {
          image: {
            path: require('../images/openclipart/spider.png'),
            scale: 0.15,
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