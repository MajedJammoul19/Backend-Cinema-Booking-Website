// Run with: node seed.js
// Seeds MongoDB with the same movies that were in your frontend's assets.js (dummyShowsData)

import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

await Movie.deleteMany({});

// ─── Shared cast list (same as dummyCastsData in assets.js) ──
const dummyCastsData = [
  { name: 'Milla Jovovich', profile_path: 'https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg' },
  { name: 'Dave Bautista', profile_path: 'https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg' },
  { name: 'Arly Jover', profile_path: 'https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg' },
  { name: 'Amara Okereke', profile_path: 'https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg' },
  { name: 'Fraser James', profile_path: 'https://image.tmdb.org/t/p/original/mGAPQG2OKTgdKFkp9YpvCSqcbgY.jpg' },
  { name: 'Deirdre Mullins', profile_path: 'https://image.tmdb.org/t/p/original/lJm89neuiVlYISEqNpGZA5kTAnP.jpg' },
  { name: 'Sebastian Stankiewicz', profile_path: 'https://image.tmdb.org/t/p/original/hLN0Ca09KwQOFLZLPIEzgTIbqqg.jpg' },
  { name: 'Tue Lunding', profile_path: 'https://image.tmdb.org/t/p/original/qY4W0zfGBYzlCyCC0QDJS1Muoa0.jpg' },
  { name: 'Jacek Dzisiewicz', profile_path: 'https://image.tmdb.org/t/p/original/6Ksb8ANhhoWWGnlM6O1qrySd7e1.jpg' },
  { name: 'Ian Hanmore', profile_path: 'https://image.tmdb.org/t/p/original/yhI4MK5atavKBD9wiJtaO1say1p.jpg' },
  { name: 'Eveline Hall', profile_path: 'https://image.tmdb.org/t/p/original/uPq4xUPiJIMW5rXF9AT0GrRqgJY.jpg' },
  { name: 'Kamila Klamut', profile_path: 'https://image.tmdb.org/t/p/original/usWnHCzbADijULREZYSJ0qfM00y.jpg' },
  { name: 'Caoilinn Springall', profile_path: 'https://image.tmdb.org/t/p/original/uZNtbPHowlBYo74U1qlTaRlrdiY.jpg' },
  { name: 'Jan Kowalewski', profile_path: 'https://image.tmdb.org/t/p/original/snk6JiXOOoRjPtHU5VMoy6qbd32.jpg' },
  { name: 'Pawel Wysocki', profile_path: 'https://image.tmdb.org/t/p/original/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg' },
  { name: 'Simon Lööf', profile_path: 'https://image.tmdb.org/t/p/original/cbZrB8crWlLEDjVUoak8Liak6s.jpg' },
  { name: 'Tomasz Cymerman', profile_path: 'https://image.tmdb.org/t/p/original/nTSPtzWu6deZTJtWXHUpACVznY4.jpg' },
];

// ─── Trailers (same as dummyTrailers in assets.js, converted to embed URLs) ──
const trailerUrls = [
  'https://www.youtube.com/embed/WpW36ldAqnM',
  'https://www.youtube.com/embed/-sAOWhvheK8',
  'https://www.youtube.com/embed/1pHDWnXmK7Y',
  'https://www.youtube.com/embed/umiKiW4En9g',
];

// ─── Helper: build dateTime showtimes for today + tomorrow ──
const buildDateTime = (showIdPrefix) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return {
    [today]: [
      { time: new Date(`${today}T13:00:00`).toISOString(), showId: `${showIdPrefix}_1` },
      { time: new Date(`${today}T17:00:00`).toISOString(), showId: `${showIdPrefix}_2` },
      { time: new Date(`${today}T21:00:00`).toISOString(), showId: `${showIdPrefix}_3` },
    ],
    [tomorrow]: [
      { time: new Date(`${tomorrow}T14:00:00`).toISOString(), showId: `${showIdPrefix}_4` },
      { time: new Date(`${tomorrow}T19:00:00`).toISOString(), showId: `${showIdPrefix}_5` },
    ],
  };
};

// ─── Movies (same data as dummyShowsData in assets.js) ──
const movies = [
  {
    title: 'In the Lost Lands',
    overview: 'A queen sends the powerful and feared sorceress Gray Alys to the ghostly wilderness of the Lost Lands in search of a magical power, where she and her guide, the drifter Boyce, must outwit and outfight both man and demon.',
    tagline: 'She seeks the power to free her people.',
    poster_path: 'https://image.tmdb.org/t/p/original/dDlfjR7gllmr8HTeN6rfrYhTdwX.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/op3qmNhvwEvyT7UFyPbIfQmKriB.jpg',
    trailer_url: trailerUrls[0],
    vote_average: 6.4,
    vote_count: 15000,
    runtime: 102,
    release_date: '2025-02-27',
    original_language: 'en',
    genres: [
      { id: 28, name: 'Action' },
      { id: 14, name: 'Fantasy' },
      { id: 12, name: 'Adventure' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('lostlands'),
    isNowShowing: true,
    isFeatured: true,
  },
  {
    title: 'Until Dawn',
    overview: "One year after her sister Melanie mysteriously disappeared, Clover and her friends head into the remote valley where she vanished in search of answers. Exploring an abandoned visitor center, they find themselves stalked by a masked killer and horrifically murdered one by one...only to wake up and find themselves back at the beginning of the same evening.",
    tagline: 'Every night a different nightmare.',
    poster_path: 'https://image.tmdb.org/t/p/original/juA4IWO52Fecx8lhAsxmDgy3M3.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/icFWIk1KfkWLZnugZAJEDauNZ94.jpg',
    trailer_url: trailerUrls[1],
    vote_average: 6.405,
    vote_count: 18000,
    runtime: 103,
    release_date: '2025-04-23',
    original_language: 'en',
    genres: [
      { id: 27, name: 'Horror' },
      { id: 9648, name: 'Mystery' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('untildawn'),
    isNowShowing: true,
    isFeatured: false,
  },
  {
    title: 'Lilo & Stitch',
    overview: 'The wildly funny and touching story of a lonely Hawaiian girl and the fugitive alien who helps to mend her broken family.',
    tagline: 'Hold on to your coconuts.',
    poster_path: 'https://image.tmdb.org/t/p/original/mKKqV23MQ0uakJS8OCE2TfV5jNS.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7Zx3wDG5bBtcfk8lcnCWDOLM4Y4.jpg',
    trailer_url: trailerUrls[2],
    vote_average: 7.117,
    vote_count: 27500,
    runtime: 108,
    release_date: '2025-05-17',
    original_language: 'en',
    genres: [
      { id: 10751, name: 'Family' },
      { id: 35, name: 'Comedy' },
      { id: 878, name: 'Fiction' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('liloandstitch'),
    isNowShowing: true,
    isFeatured: true,
  },
  {
    title: 'Havoc',
    overview: "When a drug heist swerves lethally out of control, a jaded cop fights his way through a corrupt city's criminal underworld to save a politician's son.",
    tagline: 'No law. Only disorder.',
    poster_path: 'https://image.tmdb.org/t/p/original/ubP2OsF3GlfqYPvXyLw9d78djGX.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/65MVgDa6YjSdqzh7YOA04mYkioo.jpg',
    trailer_url: trailerUrls[3],
    vote_average: 6.537,
    vote_count: 35960,
    runtime: 107,
    release_date: '2025-04-25',
    original_language: 'en',
    genres: [
      { id: 28, name: 'Action' },
      { id: 80, name: 'Crime' },
      { id: 53, name: 'Thriller' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('havoc'),
    isNowShowing: true,
    isFeatured: false,
  },
  {
    title: 'A Minecraft Movie',
    overview: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
    tagline: 'Be there and be square.',
    poster_path: 'https://image.tmdb.org/t/p/original/yFHHfHcUgGAxziP1C3lLt0q2T4s.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg',
    trailer_url: trailerUrls[0],
    vote_average: 6.516,
    vote_count: 15225,
    runtime: 101,
    release_date: '2025-03-31',
    original_language: 'en',
    genres: [
      { id: 10751, name: 'Family' },
      { id: 35, name: 'Comedy' },
      { id: 12, name: 'Adventure' },
      { id: 14, name: 'Fantasy' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('minecraft'),
    isNowShowing: true,
    isFeatured: false,
  },
  {
    title: 'Mission: Impossible - The Final Reckoning',
    overview: "Ethan Hunt and team continue their search for the terrifying AI known as the Entity — which has infiltrated intelligence networks all over the globe — with the world's governments and a mysterious ghost from Hunt's past on their trail. Joined by new allies and armed with the means to shut the Entity down for good, Hunt is in a race against time to prevent the world as we know it from changing forever.",
    tagline: 'Our lives are the sum of our choices.',
    poster_path: 'https://image.tmdb.org/t/p/original/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/1p5aI299YBnqrEEvVGJERk2MXXb.jpg',
    trailer_url: trailerUrls[1],
    vote_average: 7.042,
    vote_count: 19885,
    runtime: 170,
    release_date: '2025-05-17',
    original_language: 'en',
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 53, name: 'Thriller' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('missionimpossible'),
    isNowShowing: true,
    isFeatured: true,
  },
  {
    title: 'Thunderbolts*',
    overview: 'After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.',
    tagline: 'Everyone deserves a second shot.',
    poster_path: 'https://image.tmdb.org/t/p/original/m9EtP1Yrzv6v7dMaC9mRaGhd1um.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/rthMuZfFv4fqEU4JVbgSW9wQ8rs.jpg',
    trailer_url: trailerUrls[2],
    vote_average: 7.443,
    vote_count: 23569,
    runtime: 127,
    release_date: '2025-04-30',
    original_language: 'en',
    genres: [
      { id: 28, name: 'Action' },
      { id: 878, name: 'Science Fiction' },
      { id: 12, name: 'Adventure' },
    ],
    casts: dummyCastsData,
    dateTime: buildDateTime('thunderbolts'),
    isNowShowing: true,
    isFeatured: false,
  },
];

await Movie.insertMany(movies);
console.log(`🎬 Seeded ${movies.length} movies`);
await mongoose.disconnect();
process.exit(0);