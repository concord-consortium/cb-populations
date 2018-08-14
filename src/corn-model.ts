import { Rabbits } from './species/rabbits';
import { Hawks } from './species/hawks';
import { Agent, Environment, EnvironmentView, Rule, Interactive, Trait, ToolButton, Events, InfoView } from './populations';
import getSingleEnv from './environments/snow';
import getDoubleEnv from './environments/combo';

const ExtMath = (<any>window).ExtMath;
const LabGrapher = (<any>window).LabGrapher;

function createModel() { return ({
  brownness: 0,
  eventListeners: [],
  checkParams: function(config: IModelConfig) {
    var controlTypeParam, envParam;
    envParam = this.getParameter('envs', config, true);
    this.envColors = envParam ? envParam : ['white'];
    this["switch"] = this.getParameter('switch', config) === 'true';
    if (this["switch"]) {
      (<HTMLElement>document.querySelector("#switch-controls")).hidden = false;
    }
    this.popControl = this.getParameter('popControl', config);
    controlTypeParam = this.getParameter('controlType', config);
    this.controlType = controlTypeParam ? controlTypeParam : 'color';
    if (this.popControl === "user") {
      if (this.controlType === "color") {
        return (<HTMLElement>document.querySelector("#color-controls")).hidden = false;
      } else {
        return (<HTMLElement>document.querySelector("#genome-controls")).hidden = false;
      }
    }
  },
  run: function(config: IModelConfig) {
    var env, fieldHeight, fieldY, fields, i, k, labHeight, labY, labs, numEnvs, ref, width, x;
    env = this.envColors.length === 1 ? getSingleEnv() : getDoubleEnv();
    this.interactive = new Interactive({
      environment: env,
      speedSlider: false,
      addOrganismButtons: [
        {
          species: Rabbits,
          imagePath: require("./images/sandrat-light.png"),
          traits: [],
          limit: -1,
          scatter: true
        }, {
          species: Hawks,
          imagePath: require("./images/hawk.png"),
          traits: [],
          limit: -1,
          scatter: true
        }
      ],
      toolButtons: [
        {
          type: ToolButton.INFO_TOOL
        }, {
          type: ToolButton.CARRY_TOOL
        }
      ]
    });
    document.getElementById('environment').appendChild(this.interactive.getEnvironmentPane());
    this.env = env;
    this.env.setBackground(require("./images/environments/" + this.envColors.join("_") + ".png"));
    this.hawkSpecies = Hawks;
    this.rabbitSpecies = Rabbits;
    numEnvs = this.envColors.length;
    labs = [];
    fields = [];
    for (i = k = 0, ref = numEnvs; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      x = Math.round((this.env.width / numEnvs) * i);
      labY = 0;
      fieldY = Math.round(this.env.height / 4);
      width = Math.round(this.env.width / numEnvs);
      labHeight = Math.round(this.env.height / 4);
      fieldHeight = Math.round(this.env.height * 3 / 4);
      labs.push({
        x: x,
        y: labY,
        width: width,
        height: labHeight,
        index: i
      });
      fields.push({
        x: x,
        y: fieldY,
        width: width,
        height: fieldHeight,
        index: i
      });
    }
    this.locations = {
      all: {
        x: 0,
        y: 0,
        width: this.env.width,
        height: this.env.height
      },
      labs: labs,
      fields: fields
    };
    this.setupEnvironment(config);
    env.addRule(new Rule({
      action: (function(_this) {
        return function(agent) {
          var brownness, envIndex;
          if (agent.species === _this.rabbitSpecies) {
            const envColor = _this.envColors[_this.getAgentEnvironmentIndex(agent)];
            brownness = envColor === 'white'
              ? brownness = 0
              : envColor === 'neutral' 
                ? brownness = .5
                : brownness = 1
            if (agent.get('color') === 'brown') {
              return agent.set('chance of being seen', 0.6 - (brownness * 0.6));
            } else {
              return agent.set('chance of being seen', brownness * 0.6);
            }
          }
        };
      })(this)
    }));
    return env.addRule(new Rule({
      action: (function(_this) {
        return function(agent) {
          var envIndex, overcrowded, population;
          if (agent.species === _this.rabbitSpecies) {
            if (agent._y < _this.env.height / 4) {
              agent.set("is immortal", true);
              envIndex = _this.getAgentEnvironmentIndex(agent);
              population = _this.countRabbitsInArea(_this.locations.labs[envIndex]);
              overcrowded = population > 10;
              if (overcrowded) {
                agent.set("max offspring", 0);
                agent.set("mating chance", 0);
              } else {
                agent.set("max offspring", 1);
                agent.set("mating chance", 1);
              }
              if (overcrowded && agent.get('age') > 30 && Math.random() < 0.2) {
                return agent.die();
              }
            } else {
              return agent.set("is immortal", false);
            }
          }
        };
      })(this)
    }));
  },
  getAgentEnvironmentIndex: function(agent) {
    return Math.min(Math.floor((agent._x / this.env.width) * this.envColors.length), this.envColors.length - 1);
  },
  setupEnvironment: function(config: IModelConfig) {
    var buttons, numMice, that;
    buttons = [].slice.call($('.button img'));
    numMice = 30;
    that = this;
    buttons[0].parentNode.onclick = function() {
      var colors, i, j, k, l, ref, ref1;
      colors = that.getStartingColors(numMice, config);
      for (i = k = 0, ref = that.envColors.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        for (j = l = 0, ref1 = numMice; 0 <= ref1 ? l < ref1 : l > ref1; j = 0 <= ref1 ? ++l : --l) {
          that.addAgent(that.rabbitSpecies, [], [
            new Trait({
              name: "mating desire bonus",
              "default": -20
            }), new Trait({
              name: "age",
              "default": Math.round(Math.random() * 5)
            }), colors[j]
          ], that.locations.fields[i]);
        }
      }
      return buttons[0].parentNode.onclick = null;
    };
    buttons[1].parentNode.onclick = function() {
      var i, k, ref;
      for (i = k = 0, ref = that.envColors.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        that.addAgents(2, that.hawkSpecies, [], [
          new Trait({
            name: "mating desire bonus",
            "default": -40
          })
        ], that.locations.fields[i]);
      }
      return buttons[1].parentNode.onclick = null;
    };
    this.addEventListener(document, Environment.EVENTS.RESET, (function(_this) {
      return function() {
        (<any>window).model.setupEnvironment(config);
        _this.addedHawks = false;
        return _this.addedRabbits = false;
      };
    })(this));
  },
  getStartingColors: function(num, config) {
    var BBParam, BbParam, brownInput, brownParam, colors, givenBB, givenBb, givenBrown, givenWhite, givenbb, i, inputBB, inputBb, inputbb, k, l, percentBB, percentBb, percentBrown, ref, ref1, whiteInput;
    colors = [];
    if (this.controlType === "color") {
      percentBrown;
      if (this.popControl === "user") {
        whiteInput = $('#starting-white')[0];
        brownInput = $('#starting-brown')[0];
        givenWhite = parseFloat(whiteInput.value);
        givenBrown = parseFloat(brownInput.value);
        percentBrown = givenBrown / (givenBrown + givenWhite);
        brownInput.value = Math.round(percentBrown * 100);
        whiteInput.value = Math.round((1 - percentBrown) * 100);
      } else {
        brownParam = this.getParameter("percentBrown", config);
        percentBrown = brownParam ? parseInt(brownParam) / 100 : .75;
      }
      for (i = k = 0, ref = num; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
        colors.push(this.createRandomColorTraitByPhenotype(percentBrown));
      }
    } else {
      percentBB;
      percentBb;
      if (this.popControl === "user") {
        inputBB = $('#starting-BB')[0];
        inputBb = $('#starting-Bb')[0];
        inputbb = $('#starting-bb')[0];
        givenBB = parseFloat(inputBB.value);
        givenBb = parseFloat(inputBb.value);
        givenbb = parseFloat(inputbb.value);
        percentBB = givenBB / (givenBB + givenBb + givenbb);
        percentBb = givenBb / (givenBB + givenBb + givenbb);
        inputBB.value = Math.round(percentBB * 100);
        inputBb.value = Math.round(percentBb * 100);
        inputbb.value = Math.round((1 - (percentBB + percentBb)) * 100);
      } else {
        BBParam = this.getParameter("percentBB", config);
        percentBB = !(isNaN(BBParam)) ? parseInt(BBParam) / 100 : .38;
        BbParam = this.getParameter("percentBb", config);
        percentBb = !(isNaN(BbParam)) ? parseInt(BbParam) / 100 : .38;
      }
      for (i = l = 0, ref1 = num; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
        colors.push(this.createRandomColorTraitByGenotype(percentBB, percentBb));
      }
    }
    return colors;
  },
  getParameter: function(key: string, config?: IModelConfig, forceArray: boolean = false) {
    return config ? this.getConfigParameter(key, config) : this.getURLParameter(key, forceArray);
  },
  getURLParameter: function(key: string, forceArray: boolean = false) {
    var k, len, paramKey, paramVal, query, raw_vars, ref, v, value;
    query = window.location.search.substring(1);
    raw_vars = query.split("&");
    for (k = 0, len = raw_vars.length; k < len; k++) {
      v = raw_vars[k];
      ref = v.split("="), paramKey = ref[0], paramVal = ref[1];
      if (paramKey === key) {
        value = decodeURIComponent(paramVal).split(',');
        if (value.length === 1 && !forceArray) {
          return value[0];
        } else {
          return value;
        }
      }
    }
    return null;
  },
  getConfigParameter: function(key: string, config: IModelConfig) {
    const fullConfig = Object.assign(DEFAULT_CONFIG, config);
    return fullConfig[key];
  },
  setupGraphs: function() {
    this.graphData = {};
    this.graphs = {};
    this.graphZooms = this.envColors.map(() => 'recent');
    this.createGraphForEnvs("Mouse Colors", "Time (days)", "Number of Mice", ["#999999", "#995500"], ["Light mice", "Dark mice"], "color-graph", this.graphRabbitColors, "graph-colors", ["graph-alleles", "graph-genotypes"]);
    this.createGraphForEnvs("Mouse Genotypes", "Time (days)", "Number of Mice", ["#F2CB7C","#AAAAAA", "#555555"], ["bb mice", "bB mice", "BB mice"], "genotype-graph", this.graphRabbitGenotypes, "graph-genotypes", ["graph-alleles", "graph-colors"]);
    this.createGraphForEnvs("Mouse Alleles", "Time (days)", "Number of Alleles", ["#999999", "#995500"], ["b alleles", "B alleles"], "allele-graph", this.graphRabbitAlleles, "graph-alleles", ["graph-colors", "graph-genotypes"]);
    return document.getElementById("graph-colors").click();
  },
  createGraphForEnvs: function(title, xLabel, yLabel, colors, seriesNames, graphId, counter, showButton, hideButtons) {
    var i, k, outputOptions, ref, results, that, updateWindow, updateButtonText;
    outputOptions = {
      title: title,
      xlabel: xLabel,
      ylabel: yLabel,
      xmin: 0,
      xmax: 10,
      ymax: 100,
      ymin: 0,
      xTickCount: 10,
      yTickCount: 10,
      xFormatter: "2d",
      yFormatter: "2d",
      realTime: false,
      fontScaleRelativeToParent: true,
      sampleInterval: Environment.DEFAULT_RUN_LOOP_DELAY / 1000,
      dataType: 'samples',
      dataColors: colors,
      enableAutoScaleButton: false
    };
    updateWindow = (function(_this) {
      return function(graph, zoomType) {
        if (zoomType === 'recent') {
          var pointsPerWindow, windowNum;
          // Pan the graph window every 5 seconds
          pointsPerWindow = (5 * 1000) / Environment.DEFAULT_RUN_LOOP_DELAY;
          // Subtract 1 from the window since the first scroll isn't actually till 10 seconds
          windowNum = Math.max(0, Math.floor(graph.numberOfPoints() / pointsPerWindow) - 1);
          graph.xmin(windowNum * 5);
          graph.xmax(graph.xmin() + 10);
          graph.ymin(0);
          return graph.ymax(105);
        } else {
          const pointsPerSecond = 1000 / Environment.DEFAULT_RUN_LOOP_DELAY;
          graph.xmin(0);
          graph.xmax(Math.max(1, graph.numberOfPoints() / pointsPerSecond));
          graph.ymin(0);
          graph.ymax(105);
        }
      };
    })(this);
    updateButtonText = (button, zoomType) => {
      // The button should show text for the zoom type it switches *to*
      button.textContent = zoomType === 'recent' ? 'Show all data' : 'Show recent data';
    };
    this.graphData[showButton] = {};
    this.graphs[showButton] = {};
    results = [];
    for (i = k = 0, ref = this.envColors.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      that = this;
      results.push((function(i) {
        that.graphData[showButton][i] = [];

        const zoomButton = document.createElement("button");
        zoomButton.className = 'autoscale-button';
        zoomButton.textContent = 'Show all data';
        zoomButton.addEventListener('click', () => {
          if (that.graphZooms[i] == 'all') {
            that.graphZooms[i] = 'recent';
          } else {
            that.graphZooms[i] = 'all';
          }
          updateWindow(that.graphs[showButton][i], that.graphZooms[i]);
          updateButtonText(zoomButton, that.graphZooms[i])
        });

        // Destroy and re-create the graph on button clicks
        that.addEventListener(document.getElementById(showButton), "click", (function(_this) {
          return function() {
            var containerDiv, fullId, graphDiv;
            const currentDiv = document.getElementById("graph-container-" + i);
            if (currentDiv) {
              currentDiv.remove();
            }
            containerDiv = document.createElement("div");
            containerDiv.id = "graph-container-" + i;
            document.getElementById("graphs").appendChild(containerDiv);

            containerDiv.appendChild(zoomButton);
            updateButtonText(zoomButton, _this.graphZooms[i]);

            graphDiv = document.createElement("div");
            graphDiv.className = "graph stat-graph";
            fullId = graphId + "-" + i;
            graphDiv.id = fullId;
            containerDiv.appendChild(graphDiv);

            _this.graphs[showButton][i] = LabGrapher("#" + fullId, outputOptions);
            _this.graphData[showButton][i].forEach(function(sample) {
              return _this.graphs[showButton][i].addSamples(sample);
            });
            seriesNames.forEach(function(series, i) {
              var seriesDiv, seriesText;
              seriesText = document.createTextNode(series);
              seriesDiv = document.createElement("div");
              seriesDiv.className = "legend";
              seriesDiv.style.color = colors[i];
              seriesDiv.appendChild(seriesText);
              return containerDiv.appendChild(seriesDiv);
            });
            return updateWindow(_this.graphs[showButton][i], _this.graphZooms[i]);
          };
        })(that));
        hideButtons.forEach((function(_this) {
          return function(buttonId) {
            return _this.addEventListener(document.getElementById(buttonId), "click", function() {
              return _this.graphs[showButton][i] = null;
            });
          };
        })(that));
        that.addEventListener(document, Environment.EVENTS.RESET, (function(_this) {
          return function() {
            _this.graphData[showButton][i] = [];
            const graph = _this.graphs[showButton][i];
            if (graph) {
              graph.reset();
              return updateWindow(graph, _this.graphZooms[i]);
            }
          }
        })(that));
        return that.addEventListener(document, Environment.EVENTS.STEP, (function(_this) {
          return function() {
            that.graphData[showButton][i].push(counter.call(that, that.locations.fields[i]));
            if (_this.graphs[showButton][i]) {
              _this.graphs[showButton][i].addSamples(counter.call(that, that.locations.fields[i]));
              return updateWindow(_this.graphs[showButton][i], _this.graphZooms[i]);
            }
          };
        })(that));
      })(i));
    }
    return results;
  },
  addEventListener: function(target, type, callback) {
    this.eventListeners.push({target, type, callback});
    return target.addEventListener(type, callback);
  },
  agentsOfSpecies: function(species) {
    var a, k, len, ref, set;
    set = [];
    ref = this.env.agents;
    for (k = 0, len = ref.length; k < len; k++) {
      a = ref[k];
      if (a.species === species) {
        set.push(a);
      }
    }
    return set;
  },
  agentsOfSpeciesInRect: function(species, rectangle) {
    var a, k, len, ref, set;
    set = [];
    ref = this.env.agentsWithin(rectangle);
    for (k = 0, len = ref.length; k < len; k++) {
      a = ref[k];
      if (a.species === species) {
        set.push(a);
      }
    }
    return set;
  },
  countRabbitsInArea: function(rectangle) {
    var a, rabbits;
    rabbits = (function() {
      var k, len, ref, results;
      ref = this.env.agentsWithin(rectangle);
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        a = ref[k];
        if (a.species === this.rabbitSpecies) {
          results.push(a);
        }
      }
      return results;
    }).call(this);
    return rabbits.length;
  },
  graphRabbitColors: function(location) {
    var a, brownRabbits, k, len, ref, whiteRabbits;
    whiteRabbits = 0;
    brownRabbits = 0;
    ref = this.agentsOfSpeciesInRect(this.rabbitSpecies, location);
    for (k = 0, len = ref.length; k < len; k++) {
      a = ref[k];
      if (a.get('color') === 'white') {
        whiteRabbits++;
      }
      if (a.get('color') === 'brown') {
        brownRabbits++;
      }
    }
    return [whiteRabbits, brownRabbits];
  },
  graphRabbitGenotypes: function(location) {
    var BB, a, bB, bb, k, len, ref;
    bb = 0;
    bB = 0;
    BB = 0;
    ref = this.agentsOfSpeciesInRect(this.rabbitSpecies, location);
    for (k = 0, len = ref.length; k < len; k++) {
      a = ref[k];
      if (a.alleles.color === "a:b,b:b") {
        bb++;
      }
      if (a.alleles.color === "a:b,b:B") {
        bB++;
      }
      if (a.alleles.color === "a:B,b:b") {
        bB++;
      }
      if (a.alleles.color === "a:B,b:B") {
        BB++;
      }
    }
    return [bb, bB, BB];
  },
  graphRabbitAlleles: function(location) {
    var a, count_B, count_b, k, len, ref;
    count_b = 0;
    count_B = 0;
    ref = this.agentsOfSpeciesInRect(this.rabbitSpecies, location);
    for (k = 0, len = ref.length; k < len; k++) {
      a = ref[k];
      if (a.alleles.color.indexOf("a:b") > -1) {
        count_b++;
      } else {
        count_B++;
      }
      if (a.alleles.color.indexOf("b:b") > -1) {
        count_b++;
      } else {
        count_B++;
      }
    }
    return [count_b, count_B];
  },
  switchColors: function() {
    if (this.envColors.length === 1) {
      if (this.envColors[0] === "white") {
        this.envColors[0] = "neutral";
        return this.env.setBackground(require("./images/environments/neutral.png"));
      } else if (this.envColors[0] === "neutral") {
        this.envColors[0] = "brown";
        return this.env.setBackground(require("./images/environments/brown.png"));
      } else {
        this.envColors[0] = "white";
        return this.env.setBackground(require("./images/environments/white.png"));
      }
    }
  },
  setupControls: function() {
    var switchButton;
    switchButton = document.getElementById('switch-env');
    switchButton.onclick = this.switchColors.bind(this);
    document.getElementById('view-sex-check').onclick = (function(_this) {
      return function() {
        return (<any>window).model.showSex = document.querySelector('#view-sex-check:checked');
      };
    })(this);
    document.getElementById('view-hetero-check').onclick = (function(_this) {
      return function() {
        return (<any>window).model.showHetero = document.querySelector('#view-hetero-check:checked');
      };
    })(this);
    document.getElementById("env-controls").style.width = this.envColors.length * 450 + 68 + "px";
    return (<HTMLElement>document.querySelector(".toolbar")).style.left = this.envColors.length * 450 + 10 + "px";
  },
  setupPopulationControls: function() {
    return this.addEventListener(document, Environment.EVENTS.STEP, (function(_this) {
      return function() {
        var i, k, ref, results;
        results = [];
        for (i = k = 0, ref = _this.envColors.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          _this.checkRabbits(_this.locations.fields[i]);
          results.push(_this.checkHawks(_this.locations.fields[i]));
        }
        return results;
      };
    })(this));
  },
  setupScaling: function() {
    var baseSize, body, updateScale;
    body = document.querySelector("body");
    baseSize = {
      w: this.envColors.length * 450 + 100,
      h: 910
    };
    updateScale = function() {
      var newScale, wh, ww;
      ww = window.innerWidth;
      wh = window.innerHeight;
      newScale = 1;
      if (ww / wh < baseSize.w / baseSize.h) {
        newScale = ww / baseSize.w;
      } else {
        newScale = wh / baseSize.h;
      }
      newScale = Math.min(newScale, 1);
      return body.style.transform = 'scale(' + newScale + ',' + newScale + ')';
    };
    updateScale();
    return this.addEventListener(window, "resize", updateScale);
  },
  setProperty: function(agents, prop, val) {
    var a, k, len, results;
    results = [];
    for (k = 0, len = agents.length; k < len; k++) {
      a = agents[k];
      results.push(a.set(prop, val));
    }
    return results;
  },
  addAgents: function(number, species, properties, traits, location) {
    var i, k, ref, results;
    if (properties == null) {
      properties = [];
    }
    if (traits == null) {
      traits = [];
    }
    results = [];
    for (i = k = 0, ref = number; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      results.push(this.addAgent(species, properties, traits, location));
    }
    return results;
  },
  addAgent: function(species, properties, traits, location) {
    var agent, coords, k, len, prop;
    if (properties == null) {
      properties = [];
    }
    if (traits == null) {
      traits = [];
    }
    agent = species.createAgent(traits);
    coords = this.env.randomLocation();
    if (location) {
      coords = this.env.randomLocationWithin(location.x, location.y, location.width, location.height, true);
    }
    agent.setLocation(coords);
    for (k = 0, len = properties.length; k < len; k++) {
      prop = properties[k];
      agent.set(prop[0], prop[1]);
    }
    return this.env.addAgent(agent);
  },
  addedRabbits: false,
  addedHawks: false,
  numRabbits: 0,
  checkRabbits: function(location) {
    var allRabbits, i, k;
    allRabbits = this.agentsOfSpeciesInRect(this.rabbitSpecies, location);
    this.numRabbits = allRabbits.length;
    if (!this.addedRabbits && this.numRabbits > 0) {
      this.addedRabbits = true;
    }
    if (this.addedRabbits && this.numRabbits < 5) {
      for (let i = 0; i < 4; i++) {
        this.addAgent(this.rabbitSpecies, [], [this.copyRandomColorTrait(allRabbits)], location);
      }
    }

    // If there are no specific selective pressures (ie there are no hawks, or the hawks eat 
    // everything with equal probability), the population should be 'stabilized', so that no
    // color of rabbit dies out completely
    if (this.addedRabbits && (!this.addedHawks || this.envColors[location.index] === 'neutral')) {
      let numWhite = 0;
      allRabbits.forEach((rabbit) => {
        if (rabbit.get('color') === 'white') {
          numWhite++;
        }
      });

      // Make sure there are *some* white rabbits to ensure white rabbits are possible
      if (numWhite > 0 && numWhite < 10) {
        for (let i = 0; i < 3; i++) {
          this.addAgent(this.rabbitSpecies, [], this.createRandomColorTraitByPhenotype(0), location);
        }
      }

      const numBrown = allRabbits - numWhite;
      if (numBrown > 0 && numBrown < 10) {
        for (let i = 0; i < 3; i++) {
          this.addAgent(this.rabbitSpecies, [], this.createRandomColorTraitByPhenotype(1), location);
        }
      }
    }
    return this.setProperty(allRabbits, "mating chance", -.005 * this.numRabbits + .25);
  },
  copyRandomColorTrait: function(allRabbits) {
    var alleleString, randomRabbit;
    randomRabbit = allRabbits[Math.floor(Math.random() * allRabbits.length)];
    alleleString = randomRabbit.organism.alleles;
    return new Trait({
      name: "color",
      "default": alleleString,
      isGenetic: true
    });
  },
  createRandomColorTraitByPhenotype: function(percentBrown) {
    var alleleString, rand;
    alleleString = "";
    if (Math.random() < percentBrown) {
      rand = Math.random();
      if (rand < 1 / 3) {
        alleleString = "a:B,b:b";
      } else if (rand < 2 / 3) {
        alleleString = "a:b,b:B";
      } else {
        alleleString = "a:B,b:B";
      }
    } else {
      alleleString = "a:b,b:b";
    }
    return new Trait({
      name: "color",
      "default": alleleString,
      isGenetic: true
    });
  },
  createRandomColorTraitByGenotype: function(percentBB, percentBb) {
    var alleleString, rand;
    alleleString = "";
    rand = Math.random();
    if (rand < percentBB) {
      alleleString = "a:B,b:B";
    } else if (rand < percentBB + percentBb) {
      if (Math.random() < .5) {
        alleleString = "a:B,b:b";
      } else {
        alleleString = "a:b,b:B";
      }
    } else {
      alleleString = "a:b,b:b";
    }
    return new Trait({
      name: "color",
      "default": alleleString,
      isGenetic: true
    });
  },
  checkHawks: function(location) {
    var allHawks, numHawks;
    allHawks = this.agentsOfSpeciesInRect(this.hawkSpecies, location);
    numHawks = allHawks.length;
    if (!this.addedHawks && numHawks > 0) {
      this.addedHawks = true;
    }
    this.setProperty(allHawks, "is immortal", true);
    this.setProperty(allHawks, "mating desire bonus", -40);
    return this.setProperty(allHawks, "hunger bonus", 5);
  },
  preload: ["images/agents/rabbits/sandrat-dark.png", "images/agents/rabbits/sandrat-light.png", "images/agents/hawks/hawk.png", "images/environments/white.png", "images/environments/brown.png", "images/environments/brown_brown.png", "images/environments/brown_white.png", "images/environments/white_brown.png", "images/environments/white_white.png"]
})};

export interface IModelConfig {
  envs?: string[];
  percentBB?: number;
  percentBb?: number;
  showSwitch?: boolean;
  popControl?: string;
  controlType?: string;

  addToBackpack?: (mouse) => void;
}

const DEFAULT_CONFIG: IModelConfig = {
  envs: ['white'],
  percentBB: 25,
  percentBb: 50,
  showSwitch: false,
  popControl: 'author',
  controlType: 'genotype',
};

export function patchPrototypes(config: IModelConfig) {
  Agent.prototype.canBeCarried = function() {
    return true;
  };

  Events.removeEventListener = function(type, callback) {
    if (document.removeEventListener != null) {
      return document.removeEventListener(type, callback);
    } else {
      return console.warn("document doesn't support removeEventListener!");
    }
  }
  
  ToolButton.prototype._states['carry-tool'].mousedown = function(evt) {
    var agent;
    agent = this.getAgentAt(evt.envX, evt.envY);
    if (agent == null) {
      return;
    }
    if (!agent.canBeCarried()) {
      return;
    }
    this.pickUpAgent(agent);
    this._agent = agent;
    this._origin = {
      x: evt.envX,
      y: evt.envY
    };
    return this._agentOrigin = agent.getLocation();
  };
  
  Environment.prototype.randomLocationWithin = function(left, top, width, height, avoidBarriers) {
    var point;
    if (avoidBarriers == null) {
      avoidBarriers = false;
    }
    point = {
      x: ExtMath.randomInt(width) + left,
      y: ExtMath.randomInt(height) + top
    };
    while (avoidBarriers && this.isInBarrier(point.x, point.y)) {
      point = {
        x: ExtMath.randomInt(width) + left,
        y: ExtMath.randomInt(height) + top
      };
    }
    return point;
  };
  
  EnvironmentView.prototype.addMouseHandlers = function() {
    var eventName, k, len, ref, results;
    ref = ["click", "mousedown", "mouseup", "mousemove", "touchstart", "touchmove", "touchend"];
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      eventName = ref[k];
      results.push(this.view.addEventListener(eventName, (function(_this) {
        return function(evt) {
          var scale;
          if (evt instanceof TouchEvent) {
            (<any>evt).envX = evt.changedTouches[0].pageX - _this.view.offsetLeft;
            (<any>evt).envY = evt.changedTouches[0].pageY - _this.view.offsetTop;
          } else {
            scale = document.querySelector("body").style.transform;
            scale = parseFloat(scale.slice(scale.indexOf(",") + 1));
            evt.envX = (1 / scale) * (evt.pageX - _this.view.offsetLeft);
            evt.envY = (1 / scale) * (evt.pageY - _this.view.offsetTop);
          }
          return _this.environment.send(evt.type, evt);
        };
      })(this)));
    }
    return results;
  };
  
  if (config && config.addToBackpack) {
    InfoView.prototype.render = function(render) {
      return function() {
        const view = render.apply(this);
        const buttonHolder = document.createElement('div');
        buttonHolder.className = 'backpack-button';
        const select = document.createElement('button');
        select.onclick = () => config.addToBackpack(this.agent);
        const label = document.createTextNode('Add to Backpack');
        select.appendChild(label);
        buttonHolder.appendChild(select);
        view.appendChild(buttonHolder);
        return view;
      }
    }(InfoView.prototype.render);
  }
}

export function init(config?: IModelConfig) {
  const model = createModel();
  (window as any).model = model;

  model.checkParams(config)
  model.run(config)
  model.setupGraphs()
  model.setupControls()
  model.setupPopulationControls()
  model.setupScaling()

  return model;
}

export function reset(config?: IModelConfig) {
  const model = (window as any).model;
  model.eventListeners.forEach((listener) => (listener.target).removeEventListener(listener.type, listener.callback));
  model.interactive.reset();
  
  document.getElementById('environment').innerHTML = '';
  document.getElementById('graphs').innerHTML = '';
}