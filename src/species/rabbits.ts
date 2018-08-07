import { BasicAnimal, Species, Trait } from '../populations';
import { RabbitSpecies } from './biologica/rabbits-species';

class Rabbit extends (BasicAnimal as { new(args): any; }) {
  moving: boolean;
  _closestAgents: any[];

  constructor(args) {
    super(args);
    this.label = 'Mouse';
    this.moving = false;
  }

  step() {
    this._closestAgents = null;
    this._setSpeedAppropriateForAge();
    this._depleteEnergy();
    if (this.get('age') > this.species.defs.MATURITY_AGE && Math.random() < this.get('mating chance')) {
      this.mate();
    } else {
      this.wander();
    }
    this._incrementAge();
    return this._checkSurvival();
  };

  makeNewborn() {
    super.makeNewborn();
    const model = (<any>window).model;
    var sex = model.env.agents.length && model.env.agents[model.env.agents.length - 1].species.speciesName === "rabbits" && model.env.agents[model.env.agents.length - 1].get("sex") === "female" ? "male" : "female";
    this.set('sex', sex);
    return this.set('age', Math.round(Math.random() * 5));
  };

  mate() {
    var nearest;
    nearest = this._nearestMate();
    if (nearest != null) {
      this.chase(nearest);
      if (nearest.distanceSq < Math.pow(this.get('mating distance'), 2) && ((this.species.defs.CHANCE_OF_MATING == null) || Math.random() < this.species.defs.CHANCE_OF_MATING)) {
        this.reproduce(nearest.agent);
        return this.set('max offspring', 0);
      }
    } else {
      return this.wander(this.get('speed') * Math.random() * 0.75);
    }
  };

  resetGeneticTraits() {
    super.resetGeneticTraits();
    return this.set('genome', this._genomeButtonsString());
  };

  _genomeButtonsString() {
    const alleles = this.organism.getAlleleString().replace(/a:/g, '').replace(/b:/g, '').replace(/,/g, '');
    return alleles;
  };
}

export const Rabbits = new Species({
  speciesName: "rabbits",
  agentClass: Rabbit,
  geneticSpecies: RabbitSpecies,
  defs: {
    MAX_HEALTH: 1,
    MATURITY_AGE: 9,
    CHANCE_OF_MUTATION: 0,
    INFO_VIEW_SCALE: 2.5,
    INFO_VIEW_PROPERTIES: {
      "Fur color: ": 'color',
      "Genotype: ": 'genome',
      "Sex: ": 'sex'
    }
  },
  traits: [
        new Trait({ name: 'speed', "default": 60 }), 
        new Trait({ name: 'predator',
          "default": [
            { name: 'hawks' }, 
            { name: 'foxes' }
          ]
        }), 
        new Trait({ name: 'color', possibleValues: [''], isGenetic: true, isNumeric: false }), 
        new Trait({ name: 'vision distance', "default": 200 }), 
        new Trait({ name: 'mating distance', "default": 50 }), 
        new Trait({ name: 'max offspring', "default": 3 }), 
        new Trait({ name: 'min offspring', "default": 2 }),
        new Trait({ name: 'metabolism', "default": 0 }),
  ],
  imageRules: [
    {
      name: 'rabbit',
      contexts: ['environment', 'carry-tool'],
      rules: [
        {
          image: {
            path: require('../images/sandrat-light.png'),
            scale: 0.3,
            anchor: {
              x: 0.8,
              y: 0.47
            }
          },
          useIf: function(agent) {
            return agent.get('color') === 'white';
          }
        }, {
          image: {
            path: require('../images/sandrat-dark.png'),
            scale: 0.3,
            anchor: {
              x: 0.8,
              y: 0.47
            }
          },
          useIf: function(agent) {
            return agent.get('color') === 'brown';
          }
        }
      ]
    }, {
      name: 'sex',
      contexts: ['environment'],
      rules: [
        {
          image: {
            path: require('../images/overlays/male-stack.png'),
            scale: 0.4,
            anchor: {
              x: 0.75,
              y: 0.5
            }
          },
          useIf: function(agent) {
            return (<any>window).model.showSex && agent.get('sex') === 'male';
          }
        }, {
          image: {
            path: require('../images/overlays/female-stack.png'),
            scale: 0.4,
            anchor: {
              x: 0.75,
              y: 0.5
            }
          },
          useIf: function(agent) {
            return (<any>window).model.showSex && agent.get('sex') === 'female';
          }
        }
      ]
    }, {
      name: 'genotype',
      contexts: ['environment'],
      rules: [
        {
          image: {
            path: require('../images/overlays/heterozygous-stack.png'),
            scale: 0.4,
            anchor: {
              x: 0.75,
              y: 0.5
            }
          },
          useIf: function(agent) {
            return (<any>window).model.showHetero && (agent.alleles.color === 'a:B,b:b' || agent.alleles.color === 'a:b,b:B');
          }
        }
      ]
    }, {
      name: 'rabbit info tool',
      contexts: ['info-tool'],
      rules: [
        {
          image: {
            path: require('../images/sandrat-light.png'),
            scale: 0.4,
            anchor: {
              x: 0.4,
              y: 0.5
            }
          },
          useIf: function(agent) {
            return agent.get('color') === 'white';
          }
        }, {
          image: {
            path: require('../images/sandrat-dark.png'),
            scale: 0.4,
            anchor: {
              x: 0.4,
              y: 0.5
            }
          },
          useIf: function(agent) {
            return agent.get('color') === 'brown';
          }
        }
      ]
    }
  ]
});
