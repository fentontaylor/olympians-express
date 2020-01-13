const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const DB = require('knex')(config);
const AthleteFormatter = require('./athleteFormatter')

async function destroyAll() {
  await DB.raw("TRUNCATE TABLE athlete_events CASCADE");
  await DB.raw("TRUNCATE TABLE events CASCADE");
  await DB.raw("TRUNCATE TABLE sports CASCADE");
  await DB.raw("TRUNCATE TABLE olympics CASCADE");
  await DB.raw("TRUNCATE TABLE athletes CASCADE");
}

async function createAthlete(row) {
  try {
    let data = new AthleteFormatter(row);
    let athlete = await DB('athletes')
      .insert(data)
      .returning('*');
    return athlete[0];
  } catch (err) {
    console.log(err);
  }
}

async function createOlympics(row) {
  try {
    let games = row.Games;
    let result = await DB('olympics')
      .where({ games: games });

    if (result.length === 0) {
      let olympics = await DB('olympics')
        .insert({ games: games })
        .returning('*');

      return olympics[0];
    } else {
      return result[0];
    }
  } catch (err) {
    console.log(err);
  }
}

async function createSport(row) {
  try {
    let sport = row.Sport;
    let result = await DB('sports')
      .where({ sport: sport });

    if (result.length === 0) {
      let newSport = await DB('sports')
        .insert({ sport: sport })
        .returning('*');

      return newSport[0];
    } else {
      return result[0];
    }
  } catch (err) {
    console.log(err);
  }
}

async function createEvent(row, sport) {
  try {
    let event = row.Event;
    let result = await DB('events')
      .where({ event: event })
    
    if (result.length === 0) {
      let newEvent = await DB('events')
        .insert({ event: event, sport_id: sport.id })
        .returning('*');
      
      return newEvent[0];
    } else {
      return result[0];
    }
  } catch (err) {
    console.log(err);
  }
}

async function createAthleteEvent(row, athlete, event, olympics) {
  try {
    let medal = row.Medal === 'NA' ? null : row.Medal
    let result = await DB('athlete_events')
      .insert({
        athlete_id: athlete.id,
        event_id: event.id,
        olympics_id: olympics.id,
        medal: medal
      }).returning('*');

    return result[0];
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  createAthlete: createAthlete,
  createOlympics: createOlympics,
  createSport: createSport,
  createEvent: createEvent,
  createAthleteEvent: createAthleteEvent,
  destroyAll: destroyAll
}