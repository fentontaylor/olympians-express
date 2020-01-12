const config = require('../../knexfile')['test'];
const DB = require('knex')(config);

describe('Olympics table', () => {
  beforeEach(async () => {
    await DB.raw("TRUNCATE TABLE sports CASCADE");
  });

  afterEach(async () => {
    await DB.raw("TRUNCATE TABLE sports CASCADE");
  });

  it('has an id and name', async () => {
    await DB('sports')
      .insert({ 'id': 1, 'sport': 'Weightlifting' })
    
    await DB('events')
      .insert({
        'id': 1,
        'sport_id': 1,
        'event': "Weightlifting Women's Super- Heavyweight" })

    let event = await DB('sports')
      .join('events', 'sports.id', '=', 'events.sport_id')
    
    expect(event[0].sport).toBe('Weightlifting')
    expect(event[0].sport_id).toBe(1)
    expect(event[0].event).toBe("Weightlifting Women's Super- Heavyweight")
  })
})