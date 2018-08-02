import { BasicAnimal, Species, Trait } from '../populations';

class Hawk extends BasicAnimal {
  constructor(args) {
    super(args);
    this._viewLayer = 3;
    this.label = 'Hawk';
  }

  canBeCarried() {
    return false;
  };
}  

export const Hawks = new Species({
  speciesName: "hawks",
  agentClass: Hawk,
  defs: {
    CHANCE_OF_MUTATION: 0,
    INFO_VIEW_SCALE: 1
  },
  traits: [
    new Trait({name: 'speed', "default": 80 }), 
    new Trait({
      name: 'prey',
      "default": [
        {
          name: 'rabbits'
        }
      ]
    }), 
    new Trait({ name: 'vision distance', "default": 150 }), 
    new Trait({ name: 'eating distance', "default": 50 }), 
    new Trait({ name: 'mating distance', "default": 50 }), 
    new Trait({ name: 'max offspring', "default": 3 }), 
    new Trait({ name: 'resource consumption rate', "default": 10 }), 
    new Trait({ name: 'metabolism', "default": 0.5 }), 
    new Trait({ name: 'wings', "default": 0 })
  ],
  imageRules: [{
    name: 'hawk',
    contexts: ['environment'],
    rules: [{
      image: {
        path: require('../images/hawk.png'),
        scale: 0.15,
        anchor: {
          x: 0.5,
          y: 0.2
        }
      }
    }]
  }]
});
