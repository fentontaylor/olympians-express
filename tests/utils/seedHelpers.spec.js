const config = require('../../knexfile')['test'];
const DB = require('knex')(config);
const seedHelpers = require('../../utils/seedHelpers');
const {
  createOlympics,
  createAthlete
} = seedHelpers;

describe('Seed Helper functions', () => {
  beforeEach(async () => {
    await DB.raw("TRUNCATE TABLE athlete_events CASCADE");
    await DB.raw("TRUNCATE TABLE events CASCADE");
    await DB.raw("TRUNCATE TABLE sports CASCADE");
    await DB.raw("TRUNCATE TABLE olympics CASCADE");
    await DB.raw("TRUNCATE TABLE athletes CASCADE");
  });

  afterEach(async () => {
    await DB.raw("TRUNCATE TABLE athlete_events CASCADE");
    await DB.raw("TRUNCATE TABLE events CASCADE");
    await DB.raw("TRUNCATE TABLE sports CASCADE");
    await DB.raw("TRUNCATE TABLE olympics CASCADE");
    await DB.raw("TRUNCATE TABLE athletes CASCADE");
  });

  describe('createOlympics', () => {
    it('creates an olympics record, but not duplicates', async () => {
      let data = {
        Name: 'Ciara Everard',
        Sex: 'F',
        Age: '26',
        Height: '169',
        Weight: '54',
        Team: 'Ireland',
        Games: '2016 Summer',
        Sport: 'Athletics',
        Event: 'Athletics Women\'s 800 metres',
        Medal: 'NA'
      }

      let olympics = await createOlympics(data);
      expect(olympics.games).toBe('2016 Summer');

      let olympics2 = await createOlympics(data);
      expect(olympics2.games).toBe('2016 Summer');

      let allOlympics = await DB('olympics');
      expect(allOlympics.length).toBe(1);
    })

    describe('createAthlete', () => {
      it('creates an athlete record from data', async () => {
        let data = {
          Name: 'Ciara Everard',
          Sex: 'F',
          Age: '26',
          Height: '169',
          Weight: '54',
          Team: 'Ireland',
          Games: '2016 Summer',
          Sport: 'Athletics',
          Event: 'Athletics Women\'s 800 metres',
          Medal: 'NA'
        }

        let athlete = await createAthlete(data);
        expect(athlete.name).toBe('Ciara Everard');
        expect(athlete.sex).toBe('F');
        expect(athlete.height).toBe(169);
        expect(athlete.weight).toBe(54);
        expect(athlete.age).toBe(26);
        expect(athlete.team).toBe('Ireland');
      })
    })
  })
})