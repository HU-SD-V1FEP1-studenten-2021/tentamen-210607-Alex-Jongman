/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const express = require('express');
const yargs = require('yargs');
const open = require('open');
const multer = require('multer');

const STATUS_OK = 200;
const STATUS_NOT_FOUND = 404;
const STATUS_CONFLICT = 409;

const options = yargs
  .usage('Usage: npm start -- --port <port>')
  .options({
    p: {
      alias: 'port',
      describe: 'port nummer',
      type: 'number',
      default: 4000,
      demandOption: false,
    },
    h: {
      alias: 'host',
      describe: 'host',
      type: 'string',
      default: 'localhost',
      demandOption: true,
    },
    t: {
      alias: 'test',
      describe: 'testing',
      type: 'boolean',
      default: false,
      demandOption: false,
    },
    o: {
      alias: 'open',
      describe: 'opens default page in default browser',
      type: 'boolean',
      default: false,
      demandOption: false,
    },
  })
  .argv;

function openBrowser() {
  let BASE_URL = `http://${options.host}:${options.port}`;
  if (options.open) {
    const PATH = options.test ? 'test/test.html' : 'index.html';
    BASE_URL = `http://${options.host}:${options.port}/${PATH}`;
    open(BASE_URL);
  }
  console.log(`Server started at : ${BASE_URL}`);
}

function initializeDummyData() {
  return {
    french_fries: {
      unit: 'kg',
      quantity: {
        available: 12,
        minimum: 5,
        optimum: 15,
      },
      availableSeason: true,
      averagePricePerUnit: 1.39,
    },
    potato: {
      unit: 'kg',
      quantity: {
        available: 12,
        minimum: 5,
        optimum: 15,
      },
      availableSeason: true,
      averagePricePerUnit: 1.49,
    },
    tomato: {
      unit: 'kg',
      quantity: {
        available: 4,
        minimum: 1,
        optimum: 5,
      },
      availableSeason: true,
      averagePricePerUnit: 2.19,
    },
    asparagus: {
      unit: 'kg',
      quantity: {
        available: 4,
        minimum: 2,
        optimum: 10,
      },
      availableSeason: false,
      averagePricePerUnit: 4.5,
    },
    red_onion: {
      unit: 'kg',
      quantity: {
        available: 9,
        minimum: 1,
        optimum: 10,
      },
      availableSeason: true,
      averagePricePerUnit: 0.79,
    },
    mayonnaise: {
      unit: 'units',
      quantity: {
        available: 10,
        minimum: 15,
        optimum: 50,
      },
      availableSeason: true,
      averagePricePerUnit: 1.79,
    },
    milk: {
      unit: 'liters',
      quantity: {
        available: 5,
        minimum: 1,
        optimum: 5,
      },
      availableSeason: true,
      averagePricePerUnit: 0.9,
    },
    olive_oil: {
      unit: 'liters',
      quantity: {
        available: 5,
        minimum: 1,
        optimum: 5,
      },
      availableSeason: true,
      averagePricePerUnit: 5,
    },
    cumin_seed: {
      unit: 'gram',
      quantity: {
        available: 40,
        minimum: 100,
        optimum: 200,
      },
      availableSeason: true,
      averagePricePerUnit: 0.05,
    },
  };
}

const app = express();
const ROOTDIR = 'public';
const INGREDIENT_BASE = '/v1/ingredient';

const upload = multer();
app.use(express.static(ROOTDIR));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/v1/reset', (req, res) => {
  ingredients = initializeDummyData();
  console.log('RESET');
  console.log('---------------------------------------------------------------------------');
  res.json(STATUS_OK);
});

app.get(INGREDIENT_BASE, (req, res) => {
  res.json(ingredients);
});

app.get(`${INGREDIENT_BASE}/:key`, (req, res) => {
  const { key } = req.params;
  if (ingredients[key]) {
    res.json(ingredients[key]);
  } else {
    res.sendStatus(STATUS_NOT_FOUND);
  }
});

app.post(`${INGREDIENT_BASE}/:key`, upload.none(), (req, res) => {
  const { key } = req.params;
  const value = req.body;

  if (ingredients[key]) {
    res.sendStatus(STATUS_CONFLICT);
  } else {
    ingredients[key] = value;
    res.sendStatus(STATUS_OK);
  }
});

app.put(`${INGREDIENT_BASE}/:key`, upload.none(), (req, res) => {
  const { key } = req.params;
  const value = req.body;

  if (!ingredients[key]) {
    res.sendStatus(STATUS_NOT_FOUND);
  } else {
    ingredients[key] = value;
    res.sendStatus(STATUS_OK);
  }
});

app.delete(`${INGREDIENT_BASE}/:key`, upload.none(), (req, res) => {
  const { key } = req.params;

  if (!ingredients[key]) {
    res.sendStatus(STATUS_NOT_FOUND);
  } else {
    delete ingredients[key];
    res.sendStatus(STATUS_OK);
  }
});

let ingredients = initializeDummyData();

app.listen(options.port, () => openBrowser());
