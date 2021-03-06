(<any>window).BioLogica.Genetics.prototype.getRandomAllele = function(exampleOfGene: any) {
  var allelesOfGene, curMax, gene, i, rand, totWeights, weight, _allelesOfGene, _i, _len, _weightsOfGene;
  for (gene in this.species.geneList) {
    _allelesOfGene = this.species.geneList[gene].alleles;
    _weightsOfGene = this.species.geneList[gene].weights || [];
    if (_allelesOfGene.indexOf(exampleOfGene) >= 0) {
      allelesOfGene = _allelesOfGene;
      break;
    }
  }
  if (_weightsOfGene.length) {
    while (_weightsOfGene.length < allelesOfGene.length) {
      _weightsOfGene[_weightsOfGene.length] = 0;
    }
  } else {
    while (_weightsOfGene.length < allelesOfGene.length) {
      _weightsOfGene[_weightsOfGene.length] = 1;
    }
  }
  totWeights = _weightsOfGene.reduce((function(prev, cur) {
    return prev + cur;
  }), 0);
  rand = Math.random() * totWeights;
  curMax = 0;
  for (i = _i = 0, _len = _weightsOfGene.length; _i < _len; i = ++_i) {
    weight = _weightsOfGene[i];
    curMax += weight;
    if (rand <= curMax) {
      return allelesOfGene[i];
    }
  }
  if (console.error != null) {
    console.error('somehow did not pick one: ' + allelesOfGene[0]);
  }
  return allelesOfGene[0];
};

export const MouseSpecies = {
  name: 'Mouse',
  chromosomeNames: ['1', '2', 'XY'],
  chromosomeGeneMap: {
    '1': ['B'],
    '2': [],
    'XY': []
  },
  chromosomesLength: {
    '1': 100000000,
    '2': 100000000,
    'XY': 70000000
  },
  geneList: {
    'color': {
      alleles: ['B', 'b'],
      weights: [.5, .5],
      start: 10000000,
      length: 10584
    }
  },
  alleleLabelMap: {
    'B': 'Brown',
    'b': 'White',
    '': ''
  },
  traitRules: {
    'color': {
      'white': [['b', 'b']],
      'brown': [['B', 'b'], ['B', 'B']]
    }
  },
  /*
    Images are handled via the populations.js species
  */

  getImageName: function(org) {
    return void 0;
  },
  /*
    no lethal characteristics
  */

  makeAlive: function(org) {
    return void 0;
  }
};

