import { corn } from './species/corn';
import { spider } from './species/spider';
import { worm, wormLifestage, getWormLifestage } from './species/rootworm';
import { wormEgg } from './species/worm-egg';
import { Rabbits } from './species/rabbits';
import { Hawks } from './species/hawks';
import { Agent, Environment, Rule, Interactive } from './populations';
import { variedPlants } from './species/varied-plants';

export const simulationDaysPerYear = 200;
export const simulationStepsPerDay = 3;
export const simulationStepsPerYear = simulationDaysPerYear * simulationStepsPerDay;

let simulationStepInYear = 0;

const eggSeason = {
  startHatchStep: simulationDaysPerYear * 0.2 * simulationStepsPerDay,
  endHatchStep: simulationDaysPerYear * 0.5 * simulationStepsPerDay,
  startLayStep: simulationDaysPerYear * 0.6 * simulationStepsPerDay
};
const env = new Environment({
  columns:  45,
  rows:     45,
  imgPath: require('./images/dirt.jpg'),
  // seasonLengths: [50, 50, 50, 50],
  barriers: [],
  wrapEastWest: false,
  wrapNorthSouth: false
});

const interactive = new Interactive({
  environment: env,
  speedSlider: true,
  addOrganismButtons: [
    {
      species: corn,
      limit: 20,
      imagePath: require('./images/corn-5.png')
    },
    {
      species: wormEgg,
      limit: 20,
      imagePath: require('./images/rootworm-mature.png')
    },
    {
      species: Rabbits,
      limit: 20,
      imagePath: require('./images/sandrat-light.png')
    },
    {
      species: Hawks,
      limit: 20,
      imagePath: require('./images/hawk.png')
    }
  ]
});

export function plantMixedCrop(cornPct: number) {
  const kRows = 10, kColumns = 13,
        xStart = 30, yStart = 90,
        xSpacing = 32, ySpacing = 38;
  let cycleLength = 4,
      cornPerCycle = Math.round(cornPct / 25);
  if (cornPct === 50) {
    cycleLength = 2;
    cornPerCycle = 1;
  }
  let plantIndex = 0;
  for (let row = 0; row < kRows; row++) {
    for (let column = 0; column < kColumns; column++, plantIndex++) {
      const indexInCycle = plantIndex % cycleLength,
            seed = indexInCycle < cornPerCycle
                    ? corn.createAgent()
                    : variedPlants.createAgent();
      seed.setLocation({
          x: xStart + (column * xSpacing) + (row % 2 === 0 ? 6 : 0),
          y: yStart + (row * ySpacing) + (column % 2 === 0 ? 4 : 0),
      });
      seed.set('infected', false);
      env.addAgent(seed);
    }
  }
}

function addRandomWorms(quantity: number) {
  for (let i = 0; i < quantity; i++) {
    const matureWorm = worm.createAgent();
    matureWorm.setLocation({
        x: Math.floor(Math.random() * 10 * 45),
        y: Math.floor(Math.random() * 10 * 45)
    });
    matureWorm.set('age', matureWorm.get('maturity age'));
    matureWorm.set('energy', matureWorm.get('egg lay energy threshold') - 1);
    env.addAgent(matureWorm);
  }
}
export const addWormsSparse = () => {
  addRandomWorms(20);
};

export function addRandomSpiders(count: number) {
  for (let i = 0; i < count; i++) {
    const s = spider.createAgent();
    s.setLocation({
        x: Math.floor(Math.random() * 10 * 45),
        y: Math.floor(Math.random() * 10 * 45)
    });
    env.addAgent(s);
  }
}

const agentIsCorn = (envAgent: Agent) => {
  return envAgent.species.speciesName === "Corn";
};

const agentIsTrap = (envAgent: Agent) => {
  return envAgent.species.speciesName === "Trap";
};

const agentIsEgg = (envAgent: Agent) => {
  return envAgent.species.speciesName === "WormEgg";
};

const agentIsWorm = (envAgent: Agent) => {
  return envAgent.species.speciesName === "Worm";
};

const agentIsSpider = (envAgent: Agent) => {
  return envAgent.species.speciesName === "Spider";
};

export interface ISimulationState {
  countCorn: number;
  countTrap: number;
  countWorm: number;
  countEggs: number;
  countSpiders: number;
  nibbledCorn: number;
                                // all simulation values are zero-based
  simulationStep: number;       // cumulative step in simulation
  simulationStepInYear: number; // step in current year
  simulationDay: number;        // day in current year
  simulationYear: number;       // year
}
export const kNullSimulationState: ISimulationState =
  { countCorn: 0, countTrap: 0, countWorm: 0, countEggs: 0, countSpiders: 0, nibbledCorn: 0,
    simulationDay: 0, simulationStep: 0, simulationStepInYear: 0, simulationYear: 0 };

export function getCornStats(): ISimulationState {
  let countCorn = 0,
    countTrap = 0,
    countWorm = 0,
    countEggs = 0,
    countSpiders = 0,
    nibbledCorn = 0;
  const simulationYear = Math.floor(env.date / simulationStepsPerYear);
  const simulationStep = env.date;
  // simulationStepInYear is useful later on for agent rule tests - since those rules execute
  // once per agent per step, this should improve performance.
  simulationStepInYear = simulationStep % simulationStepsPerYear;
  const simulationDay = Math.floor(simulationStepInYear / simulationStepsPerDay);

  env.agents.forEach((a) => {
    if (agentIsCorn(a)) {
      ++ countCorn;
      if (a.get('health') < 100) {
        ++ nibbledCorn;
      }
    }
    else if (agentIsTrap(a)) {
      ++ countTrap;
    }
    else if (agentIsWorm(a)) {
      ++countWorm;
    }
    else if (agentIsEgg(a)) {
      ++countEggs;
    }
    else if (agentIsSpider(a)) {
      ++countSpiders;
    }
  });
  return { countCorn, countTrap, countWorm, countEggs, countSpiders, nibbledCorn,
          simulationStep, simulationStepInYear, simulationDay, simulationYear };
}
export function prepareToEndYear() {
  env.agents.forEach((a) => {
    // we could store location of all eggs, remove everything, then re-create eggs, but it seems that just killing
    // all the non-egg agents does the job just as well.
    if (!agentIsEgg(a)) {
      // kill off / remove all non-egg agents at end of year - this isn't visible until the simulation is restarted
      a.die();
    }
  });
}

export function endYear() {
  env.stop();
}

export interface IModelParams {
}

export function initCornModel(simulationElt: HTMLElement | null, params?: IModelParams): Interactive {
  // no simulationElt is useful for unit testing
  if (simulationElt) {
    const envPane = interactive.getEnvironmentPane();
    if (envPane) {
      simulationElt.appendChild(envPane);

      const slider: HTMLInputElement | null = document.getElementById('speed-slider') as any;
      if (slider) {
        // default slider to maximum speed
        slider.value = '100';
      }
    }
  }
  // default to maximum speed
  env.setSpeed(100);

  env.addRule(new Rule({
    test(agent: Agent) {
      // currentYearStep is updated once per step as part of the corn stats
      return agentIsEgg(agent) &&
        simulationStepInYear > (eggSeason.startHatchStep + agent.get('hatch variance')) &&
        simulationStepInYear < eggSeason.endHatchStep &&
        agent.get('hatched') === false;
    },
    action(agent: Agent) {
      agent.set('hatched', true);
      const wormAgent = worm.createAgent();
      wormAgent.setLocation(agent.getLocation());
      // hatch a worm at the location of the egg
      env.addAgent(wormAgent);
      // remove the egg agent
      agent.die();
    }
  }));
  env.addRule(new Rule({
    action(agent: Agent) {
      agent.set('chance of survival', 1);
    }
  }));

  // NOTE: since rules are executed in the context of agents, if there are
  // no agents, then no rules execute.
  // Every rule test executes once per agent per step.
  env.addRule(new Rule({
    test(agent: Agent) {
      return agentIsWorm(agent) &&
        getWormLifestage(agent) === wormLifestage.mature &&
        simulationStepInYear > (eggSeason.startLayStep + agent.get('egg lay variance')) ;
    },
    action(agent: Agent) {
      if (!agent.get('has mated') && agent.get('energy') > agent.get( 'egg lay energy threshold') ){
        const maxOffspring = agent.get('max offspring');
        const offspring = agent.get('offspring');
        // lay a single egg at the worm's location
        const wormEggAgent = wormEgg.createAgent();
        wormEggAgent.setLocation(agent.getLocation());
        env.addAgent(wormEggAgent);
        // if we haven't reached maxOffspring, we could (if we have the energy) lay more
        if (offspring + 1 >= maxOffspring) {
          // we've reached the limit on eggs for this worm
          agent.set('has mated', true);
        } else {
          // We can try and lay another egg tomorrow, or whenever we have the energy
          agent.set('egg lay variance', agent.get('egg lay variance') + (simulationStepsPerDay*3));
          // laying eggs is hard
          agent.set('energy', agent.get('energy') - 25);
        }
      }
    }
  }));

  (<any>window).model = interactive;
  return interactive;
}
