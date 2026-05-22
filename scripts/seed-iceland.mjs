import { createClient } from '@sanity/client'

const TOKEN = 'skGI48bUNDX01TWGTKO32ROfnDYZOKpAYb7vEK4njG8L8w80QizM6CVUPdwKcsRu5hMbqsDhafVnv1gwTuBUa3j9T7yooZJHOmSGKcu0z5z0qXGhok2tpZZpkB8t60XICY8Wo6GqzqNY0J1ZGuDjFGynQFOUdBC06anKDJnzomChsjg9GdGc'

const client = createClient({
  projectId: '3l5lwj8d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

const stages = [
  {
    "num": 1,
    "start": "Reykjavik",
    "end": "Njardvik",
    "komoot": "Komoot",
    "vert": 400,
    "cat": 1,
    "start_coord": {
      "lat": 64.14218,
      "lng": -21.92571
    },
    "end_coord": {
      "lat": 63.97949,
      "lng": -22.51056
    },
    "start_time": "2027-06-12T07:00:00",
    "description": "",
    "risk": "Low"
  },
  {
    "num": 2,
    "start": "Njardvik",
    "end": "Grindavik",
    "komoot": "Komoot",
    "vert": 350,
    "cat": 1,
    "start_coord": {
      "lat": 63.97949,
      "lng": -22.51056
    },
    "end_coord": {
      "lat": 63.839,
      "lng": -22.4
    },
    "start_time": "2027-06-12T22:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 3,
    "start": "Grindavik",
    "end": "Stokkseyri",
    "komoot": "Komoot",
    "vert": 560,
    "cat": 1,
    "start_coord": {
      "lat": 63.839,
      "lng": -22.4
    },
    "end_coord": {
      "lat": 63.82079,
      "lng": -20.9211
    },
    "start_time": "2027-06-13T15:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 4,
    "start": "Stokkseyri",
    "end": "Hvolsv\u00f6llur",
    "komoot": "Komoot",
    "vert": 240,
    "cat": 1,
    "start_coord": {
      "lat": 63.82079,
      "lng": -20.9211
    },
    "end_coord": {
      "lat": 63.60816,
      "lng": -20.22906
    },
    "start_time": "2027-06-14T07:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 5,
    "start": "Hvolsv\u00f6llur",
    "end": "Vik",
    "komoot": "Komoot",
    "vert": 1260,
    "cat": 1,
    "start_coord": {
      "lat": 63.60816,
      "lng": -20.22906
    },
    "end_coord": {
      "lat": 63.43069,
      "lng": -19.18051
    },
    "start_time": "2027-06-14T22:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 6,
    "start": "Vik",
    "end": "Kirkjub\u00e6jarklaustur",
    "komoot": "Komoot",
    "vert": 800,
    "cat": 1,
    "start_coord": {
      "lat": 63.43069,
      "lng": -19.18051
    },
    "end_coord": {
      "lat": 63.55214,
      "lng": -18.21876
    },
    "start_time": "2027-06-15T15:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 7,
    "start": "Kirkjub\u00e6jarklaustur",
    "end": "Skei\u00f0ar\u00e1rsandur",
    "komoot": "Komoot",
    "vert": 270,
    "cat": 1,
    "start_coord": {
      "lat": 63.55214,
      "lng": -18.21876
    },
    "end_coord": {
      "lat": 63.94789,
      "lng": -17.22792
    },
    "start_time": "2027-06-16T07:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 8,
    "start": "Skei\u00f0ar\u00e1rsandur",
    "end": "K\u00e1lfafellssta\u00f0ur",
    "komoot": "Komoot",
    "vert": 310,
    "cat": 1,
    "start_coord": {
      "lat": 63.94789,
      "lng": -17.22792
    },
    "end_coord": {
      "lat": 64.15428,
      "lng": -15.94725
    },
    "start_time": "2027-06-16T22:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 9,
    "start": "K\u00e1lfafellssta\u00f0ur",
    "end": "Hofn",
    "komoot": "Komoot",
    "vert": 290,
    "cat": 1,
    "start_coord": {
      "lat": 64.15428,
      "lng": -15.94725
    },
    "end_coord": {
      "lat": 64.25267,
      "lng": -15.20788
    },
    "start_time": "2027-06-17T15:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 10,
    "start": "Hofn",
    "end": "Dj\u00fapivogur",
    "komoot": "Komoot",
    "vert": 640,
    "cat": 1,
    "start_coord": {
      "lat": 64.25267,
      "lng": -15.20788
    },
    "end_coord": {
      "lat": 64.58326,
      "lng": -14.58352
    },
    "start_time": "2027-06-18T07:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 11,
    "start": "Dj\u00fapivogur",
    "end": "St\u00f6\u00f0varfj\u00f6r\u00f0ur",
    "komoot": "Komoot",
    "vert": 680,
    "cat": 1,
    "start_coord": {
      "lat": 64.58326,
      "lng": -14.58352
    },
    "end_coord": {
      "lat": 64.79853,
      "lng": -13.88782
    },
    "start_time": "2027-06-18T22:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 12,
    "start": "St\u00f6\u00f0varfj\u00f6r\u00f0ur",
    "end": "Eskifj\u00f6r\u00f0ur",
    "komoot": "Komoot",
    "vert": 1340,
    "cat": 1,
    "start_coord": {
      "lat": 64.79853,
      "lng": -13.88782
    },
    "end_coord": {
      "lat": 65.07762,
      "lng": -14.03313
    },
    "start_time": "2027-06-19T15:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 13,
    "start": "Eskifj\u00f6r\u00f0ur",
    "end": "Seydisfjordur",
    "komoot": "Komoot",
    "vert": 2280,
    "cat": 2,
    "start_coord": {
      "lat": 65.07762,
      "lng": -14.03313
    },
    "end_coord": {
      "lat": 65.2837,
      "lng": -13.88688
    },
    "start_time": "2027-06-20T07:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 14,
    "start": "Seydisfjordur",
    "end": "Lagarfljot (mouth) ",
    "komoot": "Komoot",
    "vert": 3300,
    "cat": 3,
    "start_coord": {
      "lat": 65.2837,
      "lng": -13.88688
    },
    "end_coord": {
      "lat": 65.58345,
      "lng": -14.27463
    },
    "start_time": "2027-06-21T01:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 15,
    "start": "Lagarfljot (mouth) ",
    "end": "Vopnafjar\u00f0ar",
    "komoot": "Komoot",
    "vert": 1270,
    "cat": 1,
    "start_coord": {
      "lat": 65.58345,
      "lng": -14.27463
    },
    "end_coord": {
      "lat": 65.7597,
      "lng": -14.82015
    },
    "start_time": "2027-06-22T00:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 16,
    "start": "Vopnafjar\u00f0ar",
    "end": "\u00de\u00f3rsh\u00f6fn",
    "komoot": "Komoot",
    "vert": 960,
    "cat": 1,
    "start_coord": {
      "lat": 65.7597,
      "lng": -14.82015
    },
    "end_coord": {
      "lat": 66.28733,
      "lng": -14.94352
    },
    "start_time": "2027-06-22T16:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 17,
    "start": "\u00de\u00f3rsh\u00f6fn",
    "end": "Raufarh\u00f6fn",
    "komoot": "Komoot",
    "vert": 760,
    "cat": 1,
    "start_coord": {
      "lat": 66.33237,
      "lng": -14.76445
    },
    "end_coord": {
      "lat": 66.30808,
      "lng": -15.84264
    },
    "start_time": "2027-06-23T07:59:00",
    "description": "gpx i s90km, 10 km between end of stage 15 missing (map error) ",
    "risk": ""
  },
  {
    "num": 18,
    "start": "Raufarh\u00f6fn",
    "end": "K\u00f3pasker",
    "komoot": "Komoot",
    "vert": 400,
    "cat": 1,
    "start_coord": {
      "lat": 66.30808,
      "lng": -15.84264
    },
    "end_coord": {
      "lat": 66.11057,
      "lng": -16.43694
    },
    "start_time": "2027-06-24T00:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 19,
    "start": "K\u00f3pasker",
    "end": "H\u00fasav\u00edk",
    "komoot": "Komoot",
    "vert": 900,
    "cat": 1,
    "start_coord": {
      "lat": 66.11057,
      "lng": -16.43694
    },
    "end_coord": {
      "lat": 65.96507,
      "lng": -17.41779
    },
    "start_time": "2027-06-24T16:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 20,
    "start": "H\u00fasav\u00edk",
    "end": "Greniv\u00edk",
    "komoot": "Komoot",
    "vert": 1130,
    "cat": 1,
    "start_coord": {
      "lat": 65.96507,
      "lng": -17.41779
    },
    "end_coord": {
      "lat": 65.85883,
      "lng": -18.25964
    },
    "start_time": "2027-06-25T07:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 21,
    "start": "Greniv\u00edk",
    "end": "Siglufj\u00f6r\u00f0ur",
    "komoot": "Komoot",
    "vert": 1500,
    "cat": 2,
    "start_coord": {
      "lat": 65.85883,
      "lng": -18.25964
    },
    "end_coord": {
      "lat": 66.05136,
      "lng": -19.01899
    },
    "start_time": "2027-06-26T00:00:00",
    "description": "gpx 60km, the last part was bugging",
    "risk": ""
  },
  {
    "num": 22,
    "start": "Siglufj\u00f6r\u00f0ur",
    "end": "Sau\u00f0\u00e1rkr\u00f3kur",
    "komoot": "Komoot",
    "vert": 1230,
    "cat": 1,
    "start_coord": {
      "lat": 66.05136,
      "lng": -19.01899
    },
    "end_coord": {
      "lat": 65.78595,
      "lng": -19.84112
    },
    "start_time": "2027-06-26T18:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 23,
    "start": "Sau\u00f0\u00e1rkr\u00f3kur",
    "end": "Skagastr\u00f6nd",
    "komoot": "Komoot",
    "vert": 650,
    "cat": 1,
    "start_coord": {
      "lat": 65.78595,
      "lng": -19.84112
    },
    "end_coord": {
      "lat": 65.74455,
      "lng": -20.24739
    },
    "start_time": "2027-06-27T10:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 24,
    "start": "Skagastr\u00f6nd",
    "end": "Bl\u00f6ndu\u00f3s",
    "komoot": "Komoot",
    "vert": 760,
    "cat": 1,
    "start_coord": {
      "lat": 65.74455,
      "lng": -20.24739
    },
    "end_coord": {
      "lat": 65.64434,
      "lng": -20.76859
    },
    "start_time": "2027-06-28T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 25,
    "start": "Bl\u00f6ndu\u00f3s",
    "end": "Hvammstangi",
    "komoot": "Komoot",
    "vert": 720,
    "cat": 1,
    "start_coord": {
      "lat": 65.64434,
      "lng": -20.76859
    },
    "end_coord": {
      "lat": 65.2747,
      "lng": -21.17205
    },
    "start_time": "2027-06-28T18:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 26,
    "start": "Hvammstangi",
    "end": "H\u00f3lmav\u00edk",
    "komoot": "Komoot",
    "vert": 1000,
    "cat": 1,
    "start_coord": {
      "lat": 65.2747,
      "lng": -21.17205
    },
    "end_coord": {
      "lat": 65.73407,
      "lng": -21.70276
    },
    "start_time": "2027-06-29T10:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 27,
    "start": "H\u00f3lmav\u00edk",
    "end": "Krossnesslaug",
    "komoot": "Komoot",
    "vert": 1370,
    "cat": 1,
    "start_coord": {
      "lat": 65.73407,
      "lng": -21.70276
    },
    "end_coord": {
      "lat": 66.04798,
      "lng": -21.50736
    },
    "start_time": "2027-06-30T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 28,
    "start": "Krossnesslaug",
    "end": "Furufj\u00f6r\u00f0ur",
    "komoot": "Komoot",
    "vert": 1800,
    "cat": 2,
    "start_coord": {
      "lat": 66.04798,
      "lng": -21.50736
    },
    "end_coord": {
      "lat": 66.26296,
      "lng": -22.24123
    },
    "start_time": "2027-06-30T18:00:00",
    "description": "arriving in Hornstrandir, finish is fully remote at a ferry stop",
    "risk": "100% unsupported"
  },
  {
    "num": 29,
    "start": "Furufj\u00f6r\u00f0ur",
    "end": "L\u00e6knish\u00fasi\u00f0",
    "komoot": "Komoot",
    "vert": 3470,
    "cat": 3,
    "start_coord": {
      "lat": 66.04798,
      "lng": -21.50737
    },
    "end_coord": {
      "lat": 66.33644,
      "lng": -22.87497
    },
    "start_time": "2027-07-01T12:00:00",
    "description": "Hornstrandir, finish at ferry stop (Charles will run this, maybe for Max too long vs hotel) TBD",
    "risk": "100% unsupported"
  },
  {
    "num": 30,
    "start": "L\u00e6knish\u00fasi\u00f0",
    "end": "Grunnavik",
    "komoot": "Komoot",
    "vert": 2800,
    "cat": 3,
    "start_coord": {
      "lat": 66.04798,
      "lng": -21.50738
    },
    "end_coord": {
      "lat": 66.2458,
      "lng": -22.87351
    },
    "start_time": "2027-07-02T10:59:00",
    "description": "Hornstrandir, finish at ferry stop",
    "risk": "100% unsupported"
  },
  {
    "num": 31,
    "start": "Grunnavik",
    "end": "Gervidals\u00e1rfoss",
    "komoot": "Komoot",
    "vert": 1160,
    "cat": 1,
    "start_coord": {
      "lat": 66.2458,
      "lng": -22.87351
    },
    "end_coord": {
      "lat": 65.7817,
      "lng": -22.58298
    },
    "start_time": "2027-07-03T10:00:00",
    "description": "entrance only available by Ferry",
    "risk": "40% unsupported"
  },
  {
    "num": 32,
    "start": "Gervidals\u00e1rfoss",
    "end": "Lambagilfoss",
    "komoot": "Komoot",
    "vert": 490,
    "cat": 1,
    "start_coord": {
      "lat": 65.7817,
      "lng": -22.58298
    },
    "end_coord": {
      "lat": 65.92114,
      "lng": -22.95958
    },
    "start_time": "2027-07-04T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 33,
    "start": "Lambagilfoss",
    "end": "Su\u00f0ureyri",
    "komoot": "Komoot",
    "vert": 1510,
    "cat": 2,
    "start_coord": {
      "lat": 65.92114,
      "lng": -22.95958
    },
    "end_coord": {
      "lat": 66.10971,
      "lng": -23.45581
    },
    "start_time": "2027-07-04T18:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 34,
    "start": "Su\u00f0ureyri",
    "end": "Fossdalur",
    "komoot": "Komoot",
    "vert": 1650,
    "cat": 2,
    "start_coord": {
      "lat": 66.10971,
      "lng": -23.45581
    },
    "end_coord": {
      "lat": 65.79604,
      "lng": -23.73781
    },
    "start_time": "2027-07-05T12:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 35,
    "start": "Fossdalur",
    "end": "B\u00edldudalur",
    "komoot": "Komoot",
    "vert": 1310,
    "cat": 1,
    "start_coord": {
      "lat": 65.79604,
      "lng": -23.73781
    },
    "end_coord": {
      "lat": 65.7067,
      "lng": -23.69029
    },
    "start_time": "2027-07-06T06:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 36,
    "start": "B\u00edldudalur",
    "end": "L\u00e1trabjarg",
    "komoot": "Komoot",
    "vert": 1650,
    "cat": 2,
    "start_coord": {
      "lat": 65.7067,
      "lng": -23.69029
    },
    "end_coord": {
      "lat": 65.50279,
      "lng": -24.52831
    },
    "start_time": "2027-07-06T22:00:00",
    "description": "2 risky sections that can be circumvented",
    "risk": ""
  },
  {
    "num": 37,
    "start": "L\u00e1trabjarg",
    "end": "Flokalundur",
    "komoot": "Komoot",
    "vert": 1820,
    "cat": 2,
    "start_coord": {
      "lat": 65.50279,
      "lng": -24.52831
    },
    "end_coord": {
      "lat": 65.56984,
      "lng": -23.17808
    },
    "start_time": "2027-07-07T16:00:00",
    "description": "1 risky section (same sa day before) that can be avoided",
    "risk": ""
  },
  {
    "num": 38,
    "start": "Flokalundur",
    "end": "Djupidalur (6km more south)",
    "komoot": "Komoot",
    "vert": 1060,
    "cat": 1,
    "start_coord": {
      "lat": 65.56984,
      "lng": -23.17808
    },
    "end_coord": {
      "lat": 65.52634,
      "lng": -22.32291
    },
    "start_time": "2027-07-08T10:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 39,
    "start": "Djupidalur (6km more south)",
    "end": "Guesthouse N\u00fdp",
    "komoot": "Komoot",
    "vert": 1080,
    "cat": 1,
    "start_coord": {
      "lat": 65.52634,
      "lng": -22.32291
    },
    "end_coord": {
      "lat": 65.33728,
      "lng": -22.11181
    },
    "start_time": "2027-07-09T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 40,
    "start": "Guesthouse N\u00fdp",
    "end": "B\u00fa\u00f0ardalur",
    "komoot": "Komoot",
    "vert": 790,
    "cat": 1,
    "start_coord": {
      "lat": 65.33728,
      "lng": -22.11181
    },
    "end_coord": {
      "lat": 65.09988,
      "lng": -21.75681
    },
    "start_time": "2027-07-09T18:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 41,
    "start": "B\u00fa\u00f0ardalur",
    "end": "Stykkish\u00f3lmur",
    "komoot": "Komoot",
    "vert": 890,
    "cat": 1,
    "start_coord": {
      "lat": 65.09988,
      "lng": -21.75681
    },
    "end_coord": {
      "lat": 64.99882,
      "lng": -22.77278
    },
    "start_time": "2027-07-10T10:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 42,
    "start": "Stykkish\u00f3lmur",
    "end": "Hellissandur",
    "komoot": "Komoot",
    "vert": 660,
    "cat": 1,
    "start_coord": {
      "lat": 64.99882,
      "lng": -22.77278
    },
    "end_coord": {
      "lat": 64.88604,
      "lng": -24.04257
    },
    "start_time": "2027-07-11T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 43,
    "start": "Hellissandur",
    "end": "Grundarfj\u00f6r\u00f0ur",
    "komoot": "Komoot",
    "vert": 570,
    "cat": 1,
    "start_coord": {
      "lat": 64.88604,
      "lng": -24.04257
    },
    "end_coord": {
      "lat": 64.79772,
      "lng": -22.79722
    },
    "start_time": "2027-07-11T18:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 44,
    "start": "Grundarfj\u00f6r\u00f0ur",
    "end": "Borgarnes",
    "komoot": "Komoot",
    "vert": 340,
    "cat": 1,
    "start_coord": {
      "lat": 64.79772,
      "lng": -22.79722
    },
    "end_coord": {
      "lat": 64.54153,
      "lng": -22.20686
    },
    "start_time": "2027-07-12T10:00:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 45,
    "start": "Borgarnes",
    "end": "Akranes",
    "komoot": "Komoot",
    "vert": 530,
    "cat": 1,
    "start_coord": {
      "lat": 64.54153,
      "lng": -22.20686
    },
    "end_coord": {
      "lat": 64.39476,
      "lng": -21.77591
    },
    "start_time": "2027-07-13T01:59:00",
    "description": "",
    "risk": ""
  },
  {
    "num": 46,
    "start": "Akranes",
    "end": "Laugardalur",
    "komoot": "Komoot",
    "vert": 840,
    "cat": 1,
    "start_coord": {
      "lat": 64.39476,
      "lng": -21.77591
    },
    "end_coord": {
      "lat": 64.14218,
      "lng": -21.92571
    },
    "start_time": "2027-07-13T18:00:00",
    "description": "",
    "risk": ""
  }
]


async function seed() {
  console.log(`Importing ${stages.length} Iceland stages...`)
  
  for (const s of stages) {
    const doc = {
      _id: `iceland-stage-${s.num}`,
      _type: 'stage',
      stageNumber: s.num,
      title: `${s.start} → ${s.end}`,
      startLocation: s.start,
      endLocation: s.end,
      country: 'Iceland',
      region: 'Iceland',
      isIceland: true,
      status: 'locked',
      distanceKm: null,
      startCoord: s.start_coord,
      endCoord: s.end_coord,
      runDate: s.start_time ? s.start_time.split('T')[0] : null,
      description: s.description || null,
      bookNumber: null,
    }
    
    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ Stage ${s.num}: ${s.start} → ${s.end}`)
    } catch(e) {
      console.error(`  ✗ Stage ${s.num}:`, e.message)
    }
  }
  
  console.log('\n✅ Iceland import complete')
}

seed().catch(console.error)
