var request = require("supertest");
var app = require('../../../app');

const DB = require('../../../utils/dbConnect');
const { dbSetupWith } = require('../../../utils/dbSeed');
const {
  createOlympics,
  createAthlete,
  createSport,
  createEvent,
  createAthleteEvent,
  destroyAll
} = require('../../../utils/dbHelpers');


describe('GET /api/v1/olympians', () => {
  beforeEach(async () => {
    await destroyAll();
    data = [
      {
        Name: 'Ciara Everard',
        Sex: 'F',
        Age: '26',
        Height: '169',
        Weight: '54',
        Team: 'Ireland',
        Games: '2016 Summer',
        Sport: 'Athletics',
        Event: 'Athletics Women\'s 800 metres',
        Medal: 'Bronze'
      },
      {
        Name: 'Maha Abdalsalam',
        Sex: 'M',
        Age: '20',
        Height: '155',
        Weight: '60',
        Team: 'Egypt',
        Games: '2016 Summer',
        Sport: 'Diving',
        Event: 'Diving Men\'s Platform',
        Medal: 'NA'
      }
    ]
    let athlete = await createAthlete(data[0]);
    let olympics = await createOlympics(data[0]);
    let sport = await createSport(data[0]);
    let event = await createEvent(data[0], sport);
    await createAthleteEvent(data[0], athlete, event, olympics);

    let athlete2 = await createAthlete(data[1]);
    let olympics2 = await createOlympics(data[1]);
    let sport2 = await createSport(data[1]);
    let event2 = await createEvent(data[1], sport2);
    await createAthleteEvent(data[1], athlete2, event2, olympics2);
  });

  afterEach(async () => {
    await destroyAll();
  });

  it('can get all olympians with their total medals won', async () => {
    let expected = {
      "olympians": [
        {
          "name": "Ciara Everard",
          "team": "Ireland",
          "age": 26,
          "sport": "Athletics",
          "total_medals_won": 1
        },
        {
          "name": "Maha Abdalsalam",
          "team": "Egypt",
          "age": 20,
          "sport": "Diving",
          "total_medals_won": 0
        }
      ]
    }
    var response = await request(app)
      .get('/api/v1/olympians');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  })

  it('can get the youngest olympian', async () => {
    let expected = {
      "olympians": [
        {
          "name": "Maha Abdalsalam",
          "team": "Egypt",
          "age": 20,
          "sport": "Diving",
          "total_medals_won": 0
        }
      ]
    }

    var response = await request(app)
      .get('/api/v1/olympians?age=youngest');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  })

  it('can get the oldest olympian', async () => {
    let expected = {
      "olympians": [
        {
          "name": "Ciara Everard",
          "team": "Ireland",
          "age": 26,
          "sport": "Athletics",
          "total_medals_won": 1
        }
      ]
    }

    var response = await request(app)
      .get('/api/v1/olympians?age=oldest');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expected);
  })
})