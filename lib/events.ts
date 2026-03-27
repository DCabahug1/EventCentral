import { distanceBetweenLocations } from "./utils";
import { Event } from "./types";

const mockEvents: Event[] = [
  // --- San Francisco, CA ---
  {
    id: 1,
    organization_id: 1,
    title: "Annual Tech Conference",
    description:
      "A full-day conference featuring keynotes and workshops on the latest trends in software development, AI, and cloud computing.",
    start_time: "2026-04-10 09:00:00",
    end_time: "2026-04-10 18:00:00",
    address: "Moscone Center, San Francisco, CA",
    address_details: "Hall B — Main Stage entrance on Howard St",
    lat: 37.7841,
    lng: -122.4006,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 12,
    organization_id: 4,
    title: "Holiday Craft Fair",
    description:
      "Over 80 local vendors selling handmade goods, artwork, and holiday gifts. Live carolers and complimentary hot cocoa.",
    start_time: "2025-12-13 10:00:00",
    end_time: "2025-12-13 18:00:00",
    address: "Union Square, San Francisco, CA",
    lat: 37.7879,
    lng: -122.4075,
    max_capacity: 2000,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Parties"],
  },
  {
    id: 21,
    organization_id: 2,
    title: "Golden Gate Sunrise Hike",
    description:
      "A guided sunrise hike across the Golden Gate Bridge followed by a group breakfast at a nearby café.",
    start_time: "2026-05-03 05:30:00",
    end_time: "2026-05-03 09:00:00",
    address: "Golden Gate Bridge, San Francisco, CA",
    address_details: "Meet at the Welcome Center parking lot",
    lat: 37.8199,
    lng: -122.4783,
    max_capacity: 40,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Austin, TX ---
  {
    id: 2,
    organization_id: 2,
    title: "Community Art Walk",
    description:
      "An evening stroll through downtown galleries showcasing local artists. Light refreshments provided at each venue.",
    start_time: "2026-04-18 17:00:00",
    end_time: "2026-04-18 21:00:00",
    address: "East 6th Street Arts District, Austin, TX",
    lat: 30.2676,
    lng: -97.7301,
    max_capacity: 200,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 14,
    organization_id: 2,
    title: "Film Screening: Indie Shorts Festival",
    description:
      "A curated evening of short films from emerging independent filmmakers. Q&A session with directors after the screening.",
    start_time: "2026-01-17 19:00:00",
    end_time: "2026-01-17 22:30:00",
    address: "Alamo Drafthouse Cinema, Austin, TX",
    address_details: "South Lamar location — Theater 3",
    lat: 30.25,
    lng: -97.767,
    max_capacity: 180,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 22,
    organization_id: 3,
    title: "Barton Springs Open Water Swim",
    description:
      "A timed open-water swim event at the iconic Barton Springs Pool. All levels welcome — competitive and casual lanes available.",
    start_time: "2026-06-14 07:00:00",
    end_time: "2026-06-14 11:00:00",
    address: "Barton Springs Pool, Austin, TX",
    lat: 30.264,
    lng: -97.771,
    max_capacity: 150,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- New York, NY ---
  {
    id: 3,
    organization_id: 1,
    title: "Startup Pitch Night",
    description:
      "Watch 10 early-stage startups pitch their ideas to a panel of investors. Networking reception to follow.",
    start_time: "2026-05-02 18:30:00",
    end_time: "2026-05-02 21:30:00",
    address: "WeWork 5th Avenue, New York, NY",
    address_details: "Floor 12 — Rooftop event space",
    lat: 40.7548,
    lng: -73.9848,
    max_capacity: 150,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 17,
    organization_id: 1,
    title: "Product Design Bootcamp",
    description:
      "An intensive two-day bootcamp covering UX research, wireframing, prototyping, and user testing. Taught by senior designers from top tech companies.",
    start_time: "2026-02-21 09:00:00",
    end_time: "2026-02-22 17:00:00",
    address: "IDEO Studio, New York, NY",
    address_details: "151 W 26th St, 12th Floor",
    lat: 40.7455,
    lng: -73.9934,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech", "Art"],
  },
  {
    id: 23,
    organization_id: 4,
    title: "Central Park Jazz Picnic",
    description:
      "Bring a blanket and enjoy live jazz performances scattered throughout the park. Food trucks and pop-up bars on site.",
    start_time: "2026-07-12 14:00:00",
    end_time: "2026-07-12 20:00:00",
    address: "Central Park, New York, NY",
    address_details: "Sheep Meadow — enter at 66th St & Central Park West",
    lat: 40.7736,
    lng: -73.9743,
    max_capacity: 2000,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 13,
    organization_id: 1,
    title: "New Year's Eve Gala",
    description:
      "Ring in 2026 with a black-tie dinner, live orchestra, open bar, and a midnight champagne toast overlooking the city skyline.",
    start_time: "2025-12-31 20:00:00",
    end_time: "2026-01-01 01:00:00",
    address: "The Ritz-Carlton New York, Central Park",
    address_details: "50 Central Park South — Grand Ballroom",
    lat: 40.7658,
    lng: -73.979,
    max_capacity: 350,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Chicago, IL ---
  {
    id: 4,
    organization_id: 3,
    title: "5K Charity Run",
    description:
      "Lace up your shoes and run for a cause! All proceeds go toward local food bank initiatives. Medals for all finishers.",
    start_time: "2026-05-15 07:00:00",
    end_time: "2026-05-15 11:00:00",
    address: "Riverside Park, Chicago, IL",
    address_details: "Start line at the N Riverside Park Mall entrance",
    lat: 41.8412,
    lng: -87.8243,
    max_capacity: 1000,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 24,
    organization_id: 2,
    title: "Chicago Deep Dish Cook-Off",
    description:
      "Eight local restaurants compete for the title of Chicago's best deep dish pizza. Unlimited tasting tickets available at the door.",
    start_time: "2026-08-09 12:00:00",
    end_time: "2026-08-09 17:00:00",
    address: "Millennium Park, Chicago, IL",
    address_details: "Jay Pritzker Pavilion lawn",
    lat: 41.8826,
    lng: -87.6226,
    max_capacity: 1500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 25,
    organization_id: 3,
    title: "Improv Comedy Showcase",
    description:
      "Six of Chicago's best improv troupes take the stage for a laugh-packed evening of unscripted comedy.",
    start_time: "2026-04-25 20:00:00",
    end_time: "2026-04-25 23:00:00",
    address: "Second City, Chicago, IL",
    address_details: "1616 N Wells St — Mainstage",
    lat: 41.913,
    lng: -87.6348,
    max_capacity: 320,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    tags: ["Parties"],
  },

  // --- Seattle, WA ---
  {
    id: 5,
    organization_id: 2,
    title: "Cooking Masterclass: Italian Cuisine",
    description:
      "Join Chef Marco Russo for a hands-on cooking class covering pasta, risotto, and tiramisu. All ingredients included.",
    start_time: "2026-05-22 14:00:00",
    end_time: "2026-05-22 17:00:00",
    address: "The Culinary Studio, Seattle, WA",
    address_details: "2716 1st Ave — Studio Kitchen on 2nd floor",
    lat: 47.6128,
    lng: -122.353,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 18,
    organization_id: 2,
    title: "Open Mic Night",
    description:
      "A welcoming stage for musicians, comedians, poets, and spoken word artists. Sign up at the door. All genres and skill levels encouraged.",
    start_time: "2026-03-06 20:00:00",
    end_time: "2026-03-06 23:00:00",
    address: "The Velvet Lounge, Seattle, WA",
    address_details: "915 E Pine St",
    lat: 47.6148,
    lng: -122.3199,
    max_capacity: 90,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 26,
    organization_id: 1,
    title: "Pike Place Market Food Tour",
    description:
      "A guided two-hour tasting tour through Pike Place Market featuring local vendors, seafood, and artisan cheeses.",
    start_time: "2026-06-27 11:00:00",
    end_time: "2026-06-27 13:00:00",
    address: "Pike Place Market, Seattle, WA",
    address_details: "Meet at the main Market sign — Pike St & 1st Ave",
    lat: 47.6085,
    lng: -122.3406,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Nashville, TN ---
  {
    id: 6,
    organization_id: 4,
    title: "Jazz in the Park",
    description:
      "An outdoor evening concert featuring three local jazz bands. Bring a blanket, grab a drink, and enjoy the music under the stars.",
    start_time: "2026-06-06 19:00:00",
    end_time: "2026-06-06 23:00:00",
    address: "Centennial Park, Nashville, TN",
    address_details: "Bandshell stage near the Parthenon replica",
    lat: 36.1493,
    lng: -86.8139,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 16,
    organization_id: 4,
    title: "Valentine's Trivia Night",
    description:
      "Grab your partner or your friends for a fun evening of themed trivia. Cash prizes for first and second place. No registration required.",
    start_time: "2026-02-14 19:00:00",
    end_time: "2026-02-14 22:00:00",
    address: "The Taproom Broadway, Nashville, TN",
    address_details: "110 Broadway — upstairs bar",
    lat: 36.16,
    lng: -86.7785,
    max_capacity: 100,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    tags: ["Parties"],
  },
  {
    id: 27,
    organization_id: 3,
    title: "Country Music Songwriter Circle",
    description:
      "An intimate evening with four Nashville songwriters performing originals and sharing the stories behind them.",
    start_time: "2026-05-30 19:30:00",
    end_time: "2026-05-30 22:00:00",
    address: "The Bluebird Cafe, Nashville, TN",
    lat: 36.11,
    lng: -86.8097,
    max_capacity: 90,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Portland, OR ---
  {
    id: 7,
    organization_id: 3,
    title: "Photography Workshop",
    description:
      "A beginner-friendly workshop covering composition, lighting, and editing techniques. Bring your own camera or smartphone.",
    start_time: "2026-06-13 10:00:00",
    end_time: "2026-06-13 14:00:00",
    address: "The Photo Loft, Portland, OR",
    address_details: "537 SE Ash St — Suite 201",
    lat: 45.5201,
    lng: -122.658,
    max_capacity: 30,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 15,
    organization_id: 3,
    title: "Urban Gardening Workshop",
    description:
      "Learn how to grow herbs, vegetables, and flowers in small urban spaces. Take home a starter kit with seeds and a planter.",
    start_time: "2026-02-07 10:00:00",
    end_time: "2026-02-07 13:00:00",
    address: "Green Thumb Community Center, Portland, OR",
    address_details: "1600 NE Alberta St",
    lat: 45.5582,
    lng: -122.648,
    max_capacity: 40,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 28,
    organization_id: 4,
    title: "Portland Night Market",
    description:
      "A vibrant night market featuring 60+ local food vendors, craft beverages, live music, and handmade goods.",
    start_time: "2026-07-18 17:00:00",
    end_time: "2026-07-18 23:00:00",
    address: "Tom McCall Waterfront Park, Portland, OR",
    lat: 45.5165,
    lng: -122.6768,
    max_capacity: 3000,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music", "Outdoor"],
  },

  // --- Denver, CO ---
  {
    id: 8,
    organization_id: 4,
    title: "Board Game Bonanza",
    description:
      "An afternoon of strategy, luck, and fun! Over 200 board games available to play. Snacks and non-alcoholic beverages included.",
    start_time: "2026-06-20 12:00:00",
    end_time: "2026-06-20 20:00:00",
    address: "The Game Vault, Denver, CO",
    address_details: "2843 Larimer St",
    lat: 39.7577,
    lng: -104.9781,
    max_capacity: 120,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    tags: ["Parties"],
  },
  {
    id: 19,
    organization_id: 3,
    title: "Mindfulness & Meditation Seminar",
    description:
      "A Saturday morning seminar on stress reduction, mindful breathing, and building a daily meditation practice. Mats and materials provided.",
    start_time: "2026-03-07 09:00:00",
    end_time: "2026-03-07 12:00:00",
    address: "Serenity Wellness Center, Denver, CO",
    address_details: "1600 Glenarm Pl — 3rd floor",
    lat: 39.7453,
    lng: -104.9905,
    max_capacity: 45,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 29,
    organization_id: 1,
    title: "Rocky Mountain Trail Run",
    description:
      "A scenic 10-mile trail run through Rocky Mountain National Park. Shuttle provided from downtown Denver.",
    start_time: "2026-08-22 07:00:00",
    end_time: "2026-08-22 14:00:00",
    address: "Rocky Mountain National Park, Estes Park, CO",
    address_details: "Bear Lake Trailhead",
    lat: 40.3129,
    lng: -105.6481,
    max_capacity: 200,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Boston, MA ---
  {
    id: 9,
    organization_id: 1,
    title: "Women in Leadership Summit",
    description:
      "A half-day summit celebrating and empowering women in leadership roles with panel discussions, networking, and workshops.",
    start_time: "2026-07-08 08:30:00",
    end_time: "2026-07-08 13:00:00",
    address: "Grand Hyatt Boston, Boston, MA",
    address_details: "One Avenue de Lafayette — Harbor Ballroom",
    lat: 42.3543,
    lng: -71.0623,
    max_capacity: 300,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 11,
    organization_id: 3,
    title: "Winter Hackathon 2025",
    description:
      "A 24-hour hackathon where teams of up to four competed to build innovative solutions to real-world problems. Prizes awarded in three categories.",
    start_time: "2025-12-06 09:00:00",
    end_time: "2025-12-07 09:00:00",
    address: "MIT Media Lab, Cambridge, MA",
    address_details: "75 Amherst St — E14 Building, 6th floor",
    lat: 42.3601,
    lng: -71.0872,
    max_capacity: 200,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 30,
    organization_id: 2,
    title: "Freedom Trail History Walk",
    description:
      "A guided 2.5-mile walk along Boston's Freedom Trail with a professional historian. Ends with drinks at a colonial-era tavern.",
    start_time: "2026-05-09 10:00:00",
    end_time: "2026-05-09 13:00:00",
    address: "Boston Common, Boston, MA",
    address_details: "Meet at the Visitor Information Center near Tremont St",
    lat: 42.3554,
    lng: -71.0655,
    max_capacity: 35,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Asheville, NC ---
  {
    id: 10,
    organization_id: 2,
    title: "Outdoor Yoga Retreat",
    description:
      "A rejuvenating full-day yoga retreat in the mountains. All skill levels welcome. Includes guided meditation and a healthy lunch.",
    start_time: "2026-07-19 08:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "Blue Ridge Parkway, Asheville, NC",
    address_details: "Craggy Gardens Picnic Area — milepost 364",
    lat: 35.6815,
    lng: -82.3918,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Madison, WI ---
  {
    id: 20,
    organization_id: 4,
    title: "Early Morning Farmers Market",
    description:
      "Shop fresh produce, artisan breads, local honey, and handmade goods from over 50 vendors. Live acoustic music and free coffee samples while supplies last.",
    start_time: "2026-03-11 05:00:00",
    end_time: "2026-03-11 11:00:00",
    address: "Capitol Square, Madison, WI",
    lat: 43.0731,
    lng: -89.4012,
    max_capacity: 600,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Los Angeles, CA ---
  {
    id: 31,
    organization_id: 1,
    title: "Rooftop Cinema Night",
    description:
      "Watch a classic film under the stars on a rooftop overlooking the LA skyline. Bring your own blanket; popcorn and drinks provided.",
    start_time: "2026-04-04 20:00:00",
    end_time: "2026-04-04 23:00:00",
    address: "The Rooftop at The Standard, Los Angeles, CA",
    address_details: "550 S Flower St — access via hotel lobby elevator",
    lat: 34.05,
    lng: -118.258,
    max_capacity: 120,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Parties"],
  },
  {
    id: 32,
    organization_id: 3,
    title: "Venice Beach Volleyball Tournament",
    description:
      "A doubles volleyball tournament on the sands of Venice Beach. Register solo or as a team. Prizes for top three pairs.",
    start_time: "2026-06-28 09:00:00",
    end_time: "2026-06-28 17:00:00",
    address: "Venice Beach, Los Angeles, CA",
    address_details: "Courts 3–8 near the basketball courts",
    lat: 33.985,
    lng: -118.4695,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 33,
    organization_id: 2,
    title: "Street Food Festival",
    description:
      "Thirty food trucks from across LA in one lot. Live DJs, a craft beer garden, and a hot sauce competition.",
    start_time: "2026-05-17 12:00:00",
    end_time: "2026-05-17 21:00:00",
    address: "Grand Park, Los Angeles, CA",
    lat: 34.0563,
    lng: -118.2468,
    max_capacity: 5000,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Miami, FL ---
  {
    id: 34,
    organization_id: 4,
    title: "South Beach Art Deco Tour",
    description:
      "A walking tour of Miami's iconic Art Deco Historic District led by a licensed architectural guide.",
    start_time: "2026-04-11 09:30:00",
    end_time: "2026-04-11 12:00:00",
    address: "Art Deco Welcome Center, Miami Beach, FL",
    address_details: "1001 Ocean Dr — meet on the front steps",
    lat: 25.7817,
    lng: -80.13,
    max_capacity: 25,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 35,
    organization_id: 1,
    title: "Latin Music Block Party",
    description:
      "Three stages, twelve acts, and non-stop dancing. Celebrate Latin culture with food, music, and community.",
    start_time: "2026-07-25 16:00:00",
    end_time: "2026-07-25 23:59:00",
    address: "Calle Ocho, Miami, FL",
    address_details: "SW 8th St between 12th and 27th Ave",
    lat: 25.7659,
    lng: -80.2264,
    max_capacity: 10000,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Parties"],
  },

  // --- Atlanta, GA ---
  {
    id: 36,
    organization_id: 2,
    title: "BeltLine Art Crawl",
    description:
      "Explore murals, pop-up galleries, and live painting sessions along the Atlanta BeltLine's Eastside Trail.",
    start_time: "2026-05-08 14:00:00",
    end_time: "2026-05-08 20:00:00",
    address: "Ponce City Market, Atlanta, GA",
    address_details:
      "675 Ponce De Leon Ave NE — start at the BeltLine entrance",
    lat: 33.7721,
    lng: -84.366,
    max_capacity: 400,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 37,
    organization_id: 3,
    title: "Atlanta BBQ Championship",
    description:
      "Pitmaster teams from across the Southeast compete for bragging rights. Unlimited tasting wristbands available.",
    start_time: "2026-08-01 11:00:00",
    end_time: "2026-08-01 19:00:00",
    address: "Piedmont Park, Atlanta, GA",
    lat: 33.7874,
    lng: -84.3733,
    max_capacity: 2500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Phoenix, AZ ---
  {
    id: 38,
    organization_id: 4,
    title: "Desert Stargazing Night",
    description:
      "A guided stargazing event in the Sonoran Desert with telescopes provided. Expert astronomers on hand to answer questions.",
    start_time: "2026-04-17 20:00:00",
    end_time: "2026-04-17 23:30:00",
    address: "McDowell Sonoran Preserve, Scottsdale, AZ",
    address_details: "Ringtail Ridge Trailhead parking lot",
    lat: 33.6839,
    lng: -111.8025,
    max_capacity: 75,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Minneapolis, MN ---
  {
    id: 39,
    organization_id: 1,
    title: "Craft Beer & Code Hackathon",
    description:
      "A weekend hackathon hosted by the Twin Cities tech community. Prizes in five categories, local craft beers on tap throughout.",
    start_time: "2026-09-12 10:00:00",
    end_time: "2026-09-13 18:00:00",
    address: "Target Field, Minneapolis, MN",
    address_details: "Gate 34 — Innovation Hub entrance",
    lat: 44.9817,
    lng: -93.2782,
    max_capacity: 350,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Camarillo, CA ---
  {
    id: 41,
    organization_id: 2,
    title: "Camarillo Certified Farmers Market",
    description:
      "A beloved weekly market featuring fresh produce, flowers, artisan foods, and local vendors. Great way to start your Saturday morning.",
    start_time: "2026-04-04 08:00:00",
    end_time: "2026-04-04 13:00:00",
    address: "Camarillo Farmers Market, Camarillo, CA",
    address_details: "2220 Ventura Blvd — parking lot behind CVS",
    lat: 34.227,
    lng: -119.0376,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 42,
    organization_id: 1,
    title: "CSUCI Tech & Innovation Expo",
    description:
      "CSU Channel Islands students and faculty showcase research projects, startup ideas, and engineering prototypes. Open to the public.",
    start_time: "2026-05-01 10:00:00",
    end_time: "2026-05-01 16:00:00",
    address: "CSU Channel Islands, Camarillo, CA",
    address_details: "1 University Dr — John Spoor Broome Library, 1st floor",
    lat: 34.1817,
    lng: -119.0431,
    max_capacity: 400,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 43,
    organization_id: 4,
    title: "Old Town Street Art Festival",
    description:
      "Local and regional artists take over Old Town Camarillo's streets with live painting, murals, and pop-up gallery booths.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 19:00:00",
    address: "Old Town Camarillo, Camarillo, CA",
    address_details: "Along Los Posas Rd between Ventura Blvd and Arneill Rd",
    lat: 34.222,
    lng: -119.044,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 44,
    organization_id: 3,
    title: "Conejo Valley 10K Trail Run",
    description:
      "A scenic 10K run through the rolling hills and open spaces surrounding Camarillo. All paces welcome — chip-timed with post-race refreshments.",
    start_time: "2026-05-16 07:30:00",
    end_time: "2026-05-16 11:00:00",
    address: "Camarillo Grove Park, Camarillo, CA",
    address_details:
      "5837 E Camarillo Springs Rd — start at the main trailhead",
    lat: 34.1982,
    lng: -119.015,
    max_capacity: 300,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- New Orleans, LA ---
  {
    id: 40,
    organization_id: 2,
    title: "French Quarter Jazz Brunch",
    description:
      "A two-hour live jazz brunch in the heart of the French Quarter. Bottomless mimosas and a full Creole brunch menu.",
    start_time: "2026-05-24 10:30:00",
    end_time: "2026-05-24 13:00:00",
    address: "Brennan's Restaurant, New Orleans, LA",
    address_details: "417 Royal St — Courtyard seating",
    lat: 29.9574,
    lng: -90.0644,
    max_capacity: 80,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  // --- Adelanto, CA ---
  {
    id: 100,
    organization_id: 1,
    title: "Adelanto Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Adelanto, CA",
    lat: 34.5826,
    lng: -117.4094,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Agoura Hills, CA ---
  {
    id: 101,
    organization_id: 2,
    title: "Agoura Hills Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Agoura Hills, CA",
    lat: 34.1568,
    lng: -118.7569,
    max_capacity: 2387,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Alameda, CA ---
  {
    id: 102,
    organization_id: 3,
    title: "Alameda Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "Alameda, CA",
    lat: 37.7609,
    lng: -122.2459,
    max_capacity: 2007,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 103,
    organization_id: 4,
    title: "Alameda Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-07 09:00:00",
    end_time: "2026-03-07 12:00:00",
    address: "Alameda, CA",
    lat: 37.7609,
    lng: -122.2459,
    max_capacity: 208,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Albany, CA ---
  {
    id: 104,
    organization_id: 1,
    title: "Albany Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Albany, CA",
    lat: 37.8875,
    lng: -122.2973,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Alhambra, CA ---
  {
    id: 105,
    organization_id: 2,
    title: "Alhambra Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-22 14:00:00",
    end_time: "2026-07-22 16:00:00",
    address: "Alhambra, CA",
    lat: 34.0989,
    lng: -118.1234,
    max_capacity: 1086,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 106,
    organization_id: 3,
    title: "Alhambra Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-02 16:00:00",
    end_time: "2026-10-02 19:00:00",
    address: "Alhambra, CA",
    lat: 34.0989,
    lng: -118.1234,
    max_capacity: 187,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Aliso Viejo, CA ---
  {
    id: 107,
    organization_id: 4,
    title: "Aliso Viejo Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-17 12:00:00",
    end_time: "2026-05-17 14:00:00",
    address: "Aliso Viejo, CA",
    lat: 33.5773,
    lng: -117.725,
    max_capacity: 206,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 108,
    organization_id: 1,
    title: "Aliso Viejo Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-24 14:00:00",
    end_time: "2026-08-24 17:00:00",
    address: "Aliso Viejo, CA",
    lat: 33.5773,
    lng: -117.725,
    max_capacity: 257,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Alturas, CA ---
  {
    id: 109,
    organization_id: 2,
    title: "Alturas Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Modoc County. Tasting tickets available at the gate.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Alturas, CA",
    lat: 41.4828,
    lng: -120.5476,
    max_capacity: 601,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Amador City, CA ---
  {
    id: 110,
    organization_id: 3,
    title: "Amador City Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Amador City. All paces welcome.",
    start_time: "2026-07-01 14:00:00",
    end_time: "2026-07-01 16:00:00",
    address: "Amador City, CA",
    lat: 38.4176,
    lng: -120.8258,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- American Canyon, CA ---
  {
    id: 111,
    organization_id: 4,
    title: "American Canyon Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "American Canyon, CA",
    lat: 38.1765,
    lng: -122.2639,
    max_capacity: 752,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Anaheim, CA ---
  {
    id: 112,
    organization_id: 1,
    title: "Anaheim Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "Anaheim, CA",
    lat: 33.8329,
    lng: -117.918,
    max_capacity: 1213,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 113,
    organization_id: 2,
    title: "Anaheim Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-01 15:00:00",
    end_time: "2026-09-01 18:00:00",
    address: "Anaheim, CA",
    lat: 33.8329,
    lng: -117.918,
    max_capacity: 914,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 114,
    organization_id: 3,
    title: "Anaheim Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Anaheim. All skill levels welcome.",
    start_time: "2026-12-08 17:00:00",
    end_time: "2026-12-08 21:00:00",
    address: "Anaheim, CA",
    lat: 33.8329,
    lng: -117.918,
    max_capacity: 35,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 115,
    organization_id: 4,
    title: "Anaheim Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-15 19:00:00",
    end_time: "2026-03-15 21:00:00",
    address: "Anaheim, CA",
    lat: 33.8329,
    lng: -117.918,
    max_capacity: 76,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Anderson, CA ---
  {
    id: 116,
    organization_id: 1,
    title: "Anderson Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-11 18:00:00",
    end_time: "2026-11-11 20:00:00",
    address: "Anderson, CA",
    lat: 40.4459,
    lng: -122.3017,
    max_capacity: 310,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Angels Camp, CA ---
  {
    id: 117,
    organization_id: 2,
    title: "Angels Camp Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Angels Camp, CA",
    lat: 38.0717,
    lng: -120.5378,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Antioch, CA ---
  {
    id: 118,
    organization_id: 3,
    title: "Antioch Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-24 16:00:00",
    end_time: "2026-09-24 18:00:00",
    address: "Antioch, CA",
    lat: 37.9918,
    lng: -121.8,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 119,
    organization_id: 4,
    title: "Antioch Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-04 18:00:00",
    end_time: "2026-12-04 21:00:00",
    address: "Antioch, CA",
    lat: 37.9918,
    lng: -121.8,
    max_capacity: 49,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 120,
    organization_id: 1,
    title: "Antioch Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Contra Costa County artists.",
    start_time: "2026-03-11 08:00:00",
    end_time: "2026-03-11 12:00:00",
    address: "Antioch, CA",
    lat: 37.9918,
    lng: -121.8,
    max_capacity: 210,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Apple Valley, CA ---
  {
    id: 121,
    organization_id: 2,
    title: "Apple Valley Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Apple Valley, CA",
    lat: 34.501,
    lng: -117.1857,
    max_capacity: 552,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 122,
    organization_id: 3,
    title: "Apple Valley Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-08-03 14:00:00",
    end_time: "2026-08-03 17:00:00",
    address: "Apple Valley, CA",
    lat: 34.501,
    lng: -117.1857,
    max_capacity: 153,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Arcadia, CA ---
  {
    id: 123,
    organization_id: 4,
    title: "Arcadia Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "Arcadia, CA",
    lat: 34.1364,
    lng: -118.0386,
    max_capacity: 417,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 124,
    organization_id: 1,
    title: "Arcadia Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-01-11 19:00:00",
    end_time: "2026-01-11 22:00:00",
    address: "Arcadia, CA",
    lat: 34.1364,
    lng: -118.0386,
    max_capacity: 38,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Arcata, CA ---
  {
    id: 125,
    organization_id: 2,
    title: "Arcata Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-06 16:00:00",
    end_time: "2026-09-06 18:00:00",
    address: "Arcata, CA",
    lat: 40.8615,
    lng: -124.0878,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Arroyo Grande, CA ---
  {
    id: 126,
    organization_id: 3,
    title: "Arroyo Grande Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-27 16:00:00",
    end_time: "2026-09-27 18:00:00",
    address: "Arroyo Grande, CA",
    lat: 35.122,
    lng: -120.5872,
    max_capacity: 1084,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Artesia, CA ---
  {
    id: 127,
    organization_id: 4,
    title: "Artesia Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-03 13:00:00",
    end_time: "2026-06-03 15:00:00",
    address: "Artesia, CA",
    lat: 33.8604,
    lng: -118.088,
    max_capacity: 71,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Arvin, CA ---
  {
    id: 128,
    organization_id: 1,
    title: "Arvin Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-09-03 16:00:00",
    end_time: "2026-09-03 18:00:00",
    address: "Arvin, CA",
    lat: 35.2133,
    lng: -118.8242,
    max_capacity: 592,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Atascadero, CA ---
  {
    id: 129,
    organization_id: 2,
    title: "Atascadero Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-07-07 14:00:00",
    end_time: "2026-07-07 16:00:00",
    address: "Atascadero, CA",
    lat: 35.4918,
    lng: -120.6683,
    max_capacity: 124,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Atherton, CA ---
  {
    id: 130,
    organization_id: 3,
    title: "Atherton Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Atherton, CA",
    lat: 37.4613,
    lng: -122.1983,
    max_capacity: 550,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Atwater, CA ---
  {
    id: 131,
    organization_id: 4,
    title: "Atwater Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Merced County. Tasting tickets available at the gate.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Atwater, CA",
    lat: 37.3425,
    lng: -120.6148,
    max_capacity: 1501,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Auburn, CA ---
  {
    id: 132,
    organization_id: 1,
    title: "Auburn Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Auburn, CA",
    lat: 38.8973,
    lng: -121.0762,
    max_capacity: 457,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Avalon, CA ---
  {
    id: 133,
    organization_id: 2,
    title: "Avalon Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-09 16:00:00",
    end_time: "2026-09-09 18:00:00",
    address: "Avalon, CA",
    lat: 33.3442,
    lng: -118.3256,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Avenal, CA ---
  {
    id: 134,
    organization_id: 3,
    title: "Avenal Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-26 12:00:00",
    end_time: "2026-05-26 14:00:00",
    address: "Avenal, CA",
    lat: 35.9985,
    lng: -120.1316,
    max_capacity: 196,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Azusa, CA ---
  {
    id: 135,
    organization_id: 4,
    title: "Azusa Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Azusa, CA",
    lat: 34.138,
    lng: -117.9032,
    max_capacity: 194,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 136,
    organization_id: 1,
    title: "Azusa Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Azusa, CA",
    lat: 34.138,
    lng: -117.9032,
    max_capacity: 125,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Bakersfield, CA ---
  {
    id: 137,
    organization_id: 2,
    title: "Bakersfield Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Bakersfield's favorite dog park. Treats provided.",
    start_time: "2026-03-21 10:00:00",
    end_time: "2026-03-21 12:00:00",
    address: "Bakersfield, CA",
    lat: 35.3721,
    lng: -119.0199,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 138,
    organization_id: 3,
    title: "Bakersfield Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-06-01 12:00:00",
    end_time: "2026-06-01 15:00:00",
    address: "Bakersfield, CA",
    lat: 35.3721,
    lng: -119.0199,
    max_capacity: 2039,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 139,
    organization_id: 4,
    title: "Bakersfield Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-08 14:00:00",
    end_time: "2026-09-08 18:00:00",
    address: "Bakersfield, CA",
    lat: 35.3721,
    lng: -119.0199,
    max_capacity: 90,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 140,
    organization_id: 1,
    title: "Bakersfield Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-12-15 16:00:00",
    end_time: "2026-12-15 18:00:00",
    address: "Bakersfield, CA",
    lat: 35.3721,
    lng: -119.0199,
    max_capacity: 341,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Baldwin Park, CA ---
  {
    id: 141,
    organization_id: 2,
    title: "Baldwin Park Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-17 15:00:00",
    end_time: "2026-08-17 17:00:00",
    address: "Baldwin Park, CA",
    lat: 34.0854,
    lng: -117.9608,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 142,
    organization_id: 3,
    title: "Baldwin Park Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-24 17:00:00",
    end_time: "2026-11-24 20:00:00",
    address: "Baldwin Park, CA",
    lat: 34.0854,
    lng: -117.9608,
    max_capacity: 52,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Banning, CA ---
  {
    id: 143,
    organization_id: 4,
    title: "Banning Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-11 12:00:00",
    end_time: "2026-05-11 14:00:00",
    address: "Banning, CA",
    lat: 33.9258,
    lng: -116.8758,
    max_capacity: 102,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Barstow, CA ---
  {
    id: 144,
    organization_id: 1,
    title: "Barstow Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-08 12:00:00",
    end_time: "2026-05-08 14:00:00",
    address: "Barstow, CA",
    lat: 34.9,
    lng: -117.0186,
    max_capacity: 192,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Beaumont, CA ---
  {
    id: 145,
    organization_id: 2,
    title: "Beaumont Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-09 16:00:00",
    end_time: "2026-09-09 18:00:00",
    address: "Beaumont, CA",
    lat: 33.9296,
    lng: -116.977,
    max_capacity: 52,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 146,
    organization_id: 3,
    title: "Beaumont Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-12-16 18:00:00",
    end_time: "2026-12-16 21:00:00",
    address: "Beaumont, CA",
    lat: 33.9296,
    lng: -116.977,
    max_capacity: 753,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Bell, CA ---
  {
    id: 147,
    organization_id: 4,
    title: "Bell Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Bell, CA",
    lat: 33.9755,
    lng: -118.189,
    max_capacity: 430,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Bell Gardens, CA ---
  {
    id: 148,
    organization_id: 1,
    title: "Bell Gardens Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Bell Gardens, CA",
    lat: 33.9633,
    lng: -118.1573,
    max_capacity: 430,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Bellflower, CA ---
  {
    id: 149,
    organization_id: 2,
    title: "Bellflower Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Bellflower. All paces welcome.",
    start_time: "2026-11-08 18:00:00",
    end_time: "2026-11-08 20:00:00",
    address: "Bellflower, CA",
    lat: 33.8837,
    lng: -118.115,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 150,
    organization_id: 3,
    title: "Bellflower Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-15 08:00:00",
    end_time: "2026-02-15 11:00:00",
    address: "Bellflower, CA",
    lat: 33.8837,
    lng: -118.115,
    max_capacity: 571,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Belmont, CA ---
  {
    id: 151,
    organization_id: 4,
    title: "Belmont Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Belmont's favorite dog park. Treats provided.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Belmont, CA",
    lat: 37.519,
    lng: -122.277,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Belvedere, CA ---
  {
    id: 152,
    organization_id: 1,
    title: "Belvedere Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Belvedere, CA",
    lat: 37.874,
    lng: -122.4656,
    max_capacity: 152,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Benicia, CA ---
  {
    id: 153,
    organization_id: 2,
    title: "Benicia Half Marathon",
    description:
      "A scenic half marathon through the heart of Benicia. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-18 10:00:00",
    end_time: "2026-03-18 12:00:00",
    address: "Benicia, CA",
    lat: 38.0487,
    lng: -122.1612,
    max_capacity: 1846,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Berkeley, CA ---
  {
    id: 154,
    organization_id: 3,
    title: "Berkeley Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Berkeley, CA",
    lat: 37.8694,
    lng: -122.2749,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 155,
    organization_id: 4,
    title: "Berkeley Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-12-01 18:00:00",
    end_time: "2026-12-01 21:00:00",
    address: "Berkeley, CA",
    lat: 37.8694,
    lng: -122.2749,
    max_capacity: 329,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 156,
    organization_id: 1,
    title: "Berkeley Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-08 08:00:00",
    end_time: "2026-03-08 12:00:00",
    address: "Berkeley, CA",
    lat: 37.8694,
    lng: -122.2749,
    max_capacity: 30,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Beverly Hills, CA ---
  {
    id: 157,
    organization_id: 2,
    title: "Beverly Hills Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-03-15 10:00:00",
    end_time: "2026-03-15 12:00:00",
    address: "Beverly Hills, CA",
    lat: 34.0724,
    lng: -118.4016,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Big Bear Lake, CA ---
  {
    id: 158,
    organization_id: 3,
    title: "Big Bear Lake Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-02 12:00:00",
    end_time: "2026-05-02 14:00:00",
    address: "Big Bear Lake, CA",
    lat: 34.2413,
    lng: -116.914,
    max_capacity: 424,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Biggs, CA ---
  {
    id: 159,
    organization_id: 4,
    title: "Biggs Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-09 16:00:00",
    end_time: "2026-09-09 18:00:00",
    address: "Biggs, CA",
    lat: 39.4133,
    lng: -121.714,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Bishop, CA ---
  {
    id: 160,
    organization_id: 1,
    title: "Bishop Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-06-24 13:00:00",
    end_time: "2026-06-24 15:00:00",
    address: "Bishop, CA",
    lat: 37.361,
    lng: -118.3976,
    max_capacity: 1925,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Blue Lake, CA ---
  {
    id: 161,
    organization_id: 2,
    title: "Blue Lake Multicultural Festival",
    description:
      "A celebration of Blue Lake's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-25 17:00:00",
    end_time: "2026-10-25 19:00:00",
    address: "Blue Lake, CA",
    lat: 40.8811,
    lng: -123.9856,
    max_capacity: 2129,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Blythe, CA ---
  {
    id: 162,
    organization_id: 3,
    title: "Blythe Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Blythe, CA",
    lat: 33.6132,
    lng: -114.5935,
    max_capacity: 179,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Bradbury, CA ---
  {
    id: 163,
    organization_id: 4,
    title: "Bradbury Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "Bradbury, CA",
    lat: 34.153,
    lng: -117.9643,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Brawley, CA ---
  {
    id: 164,
    organization_id: 1,
    title: "Brawley Multicultural Festival",
    description:
      "A celebration of Brawley's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-27 13:00:00",
    end_time: "2026-06-27 15:00:00",
    address: "Brawley, CA",
    lat: 32.9808,
    lng: -115.5289,
    max_capacity: 569,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Brea, CA ---
  {
    id: 165,
    organization_id: 2,
    title: "Brea Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Brea's favorite dog park. Treats provided.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Brea, CA",
    lat: 33.9215,
    lng: -117.8952,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Brentwood, CA ---
  {
    id: 166,
    organization_id: 3,
    title: "Brentwood Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Contra Costa County. Tasting tickets available at the gate.",
    start_time: "2026-02-26 09:00:00",
    end_time: "2026-02-26 11:00:00",
    address: "Brentwood, CA",
    lat: 37.9307,
    lng: -121.6966,
    max_capacity: 1941,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 167,
    organization_id: 4,
    title: "Brentwood Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-05-06 11:00:00",
    end_time: "2026-05-06 14:00:00",
    address: "Brentwood, CA",
    lat: 37.9307,
    lng: -121.6966,
    max_capacity: 142,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Brisbane, CA ---
  {
    id: 168,
    organization_id: 1,
    title: "Brisbane Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-01-19 08:00:00",
    end_time: "2026-01-19 10:00:00",
    address: "Brisbane, CA",
    lat: 37.6797,
    lng: -122.3999,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Buellton, CA ---
  {
    id: 169,
    organization_id: 2,
    title: "Buellton 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-02 15:00:00",
    end_time: "2026-08-02 17:00:00",
    address: "Buellton, CA",
    lat: 34.6109,
    lng: -120.1954,
    max_capacity: 723,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Buena Park, CA ---
  {
    id: 170,
    organization_id: 3,
    title: "Buena Park Half Marathon",
    description:
      "A scenic half marathon through the heart of Buena Park. Certified course, chip timing, and finisher medals.",
    start_time: "2026-07-01 14:00:00",
    end_time: "2026-07-01 16:00:00",
    address: "Buena Park, CA",
    lat: 33.8651,
    lng: -118.0005,
    max_capacity: 1826,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 171,
    organization_id: 4,
    title: "Buena Park Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-10-08 16:00:00",
    end_time: "2026-10-08 19:00:00",
    address: "Buena Park, CA",
    lat: 33.8651,
    lng: -118.0005,
    max_capacity: 827,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Burbank, CA ---
  {
    id: 172,
    organization_id: 1,
    title: "Burbank Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-17 12:00:00",
    end_time: "2026-05-17 14:00:00",
    address: "Burbank, CA",
    lat: 34.1794,
    lng: -118.3104,
    max_capacity: 76,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 173,
    organization_id: 2,
    title: "Burbank 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-24 14:00:00",
    end_time: "2026-08-24 17:00:00",
    address: "Burbank, CA",
    lat: 34.1794,
    lng: -118.3104,
    max_capacity: 637,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 174,
    organization_id: 3,
    title: "Burbank Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Burbank. All paces welcome.",
    start_time: "2026-11-04 16:00:00",
    end_time: "2026-11-04 20:00:00",
    address: "Burbank, CA",
    lat: 34.1794,
    lng: -118.3104,
    max_capacity: 68,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Burlingame, CA ---
  {
    id: 175,
    organization_id: 4,
    title: "Burlingame Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-11 12:00:00",
    end_time: "2026-05-11 14:00:00",
    address: "Burlingame, CA",
    lat: 37.5888,
    lng: -122.3616,
    max_capacity: 236,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Calabasas, CA ---
  {
    id: 176,
    organization_id: 1,
    title: "Calabasas Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-27 16:00:00",
    end_time: "2026-09-27 18:00:00",
    address: "Calabasas, CA",
    lat: 34.1397,
    lng: -118.6359,
    max_capacity: 172,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Calexico, CA ---
  {
    id: 177,
    organization_id: 2,
    title: "Calexico Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-13 17:00:00",
    end_time: "2026-10-13 19:00:00",
    address: "Calexico, CA",
    lat: 32.6752,
    lng: -115.5026,
    max_capacity: 113,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- California City, CA ---
  {
    id: 178,
    organization_id: 3,
    title: "California City Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of California City. All skill levels welcome.",
    start_time: "2026-08-23 15:00:00",
    end_time: "2026-08-23 17:00:00",
    address: "California City, CA",
    lat: 35.1275,
    lng: -117.9939,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Calimesa, CA ---
  {
    id: 179,
    organization_id: 4,
    title: "Calimesa Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Calimesa, CA",
    lat: 34.0062,
    lng: -117.0575,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Calipatria, CA ---
  {
    id: 180,
    organization_id: 1,
    title: "Calipatria Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-07 14:00:00",
    end_time: "2026-07-07 16:00:00",
    address: "Calipatria, CA",
    lat: 33.1285,
    lng: -115.5104,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Calistoga, CA ---
  {
    id: 181,
    organization_id: 2,
    title: "Calistoga Half Marathon",
    description:
      "A scenic half marathon through the heart of Calistoga. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Calistoga, CA",
    lat: 38.5784,
    lng: -122.5801,
    max_capacity: 1146,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Campbell, CA ---
  {
    id: 182,
    organization_id: 3,
    title: "Campbell Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-20 12:00:00",
    end_time: "2026-05-20 14:00:00",
    address: "Campbell, CA",
    lat: 37.2906,
    lng: -121.9466,
    max_capacity: 684,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Canyon Lake, CA ---
  {
    id: 183,
    organization_id: 4,
    title: "Canyon Lake Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Canyon Lake, CA",
    lat: 33.6897,
    lng: -117.2676,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Capitola, CA ---
  {
    id: 184,
    organization_id: 1,
    title: "Capitola Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-09-24 16:00:00",
    end_time: "2026-09-24 18:00:00",
    address: "Capitola, CA",
    lat: 36.9738,
    lng: -121.9555,
    max_capacity: 206,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Carlsbad, CA ---
  {
    id: 185,
    organization_id: 2,
    title: "Carlsbad Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Carlsbad, CA",
    lat: 33.1597,
    lng: -117.349,
    max_capacity: 766,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 186,
    organization_id: 3,
    title: "Carlsbad Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-02-06 08:00:00",
    end_time: "2026-02-06 11:00:00",
    address: "Carlsbad, CA",
    lat: 33.1597,
    lng: -117.349,
    max_capacity: 267,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 187,
    organization_id: 4,
    title: "Carlsbad Trail Run",
    description:
      "Scenic trail run through open spaces near Carlsbad. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-13 10:00:00",
    end_time: "2026-05-13 14:00:00",
    address: "Carlsbad, CA",
    lat: 33.1597,
    lng: -117.349,
    max_capacity: 268,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Carmel-by-the-Sea, CA ---
  {
    id: 188,
    organization_id: 1,
    title: "Carmel-by-the-Sea Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "Carmel-by-the-Sea, CA",
    lat: 36.5585,
    lng: -121.92,
    max_capacity: 383,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Carpinteria, CA ---
  {
    id: 189,
    organization_id: 2,
    title: "Carpinteria Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-02-23 09:00:00",
    end_time: "2026-02-23 11:00:00",
    address: "Carpinteria, CA",
    lat: 34.3992,
    lng: -119.5082,
    max_capacity: 653,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Carson, CA ---
  {
    id: 190,
    organization_id: 3,
    title: "Carson Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-01-19 08:00:00",
    end_time: "2026-01-19 10:00:00",
    address: "Carson, CA",
    lat: 33.8287,
    lng: -118.285,
    max_capacity: 420,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 191,
    organization_id: 4,
    title: "Carson Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Carson. All skill levels welcome.",
    start_time: "2026-04-26 10:00:00",
    end_time: "2026-04-26 13:00:00",
    address: "Carson, CA",
    lat: 33.8287,
    lng: -118.285,
    max_capacity: 21,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Cathedral City, CA ---
  {
    id: 192,
    organization_id: 1,
    title: "Cathedral City Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-25 11:00:00",
    end_time: "2026-04-25 13:00:00",
    address: "Cathedral City, CA",
    lat: 33.7798,
    lng: -116.4652,
    max_capacity: 111,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 193,
    organization_id: 2,
    title: "Cathedral City Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-05 13:00:00",
    end_time: "2026-07-05 16:00:00",
    address: "Cathedral City, CA",
    lat: 33.7798,
    lng: -116.4652,
    max_capacity: 52,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Ceres, CA ---
  {
    id: 194,
    organization_id: 3,
    title: "Ceres Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-08 15:00:00",
    end_time: "2026-08-08 17:00:00",
    address: "Ceres, CA",
    lat: 37.597,
    lng: -120.9556,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Cerritos, CA ---
  {
    id: 195,
    organization_id: 4,
    title: "Cerritos Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-01-16 08:00:00",
    end_time: "2026-01-16 10:00:00",
    address: "Cerritos, CA",
    lat: 33.863,
    lng: -118.0601,
    max_capacity: 236,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Chico, CA ---
  {
    id: 196,
    organization_id: 1,
    title: "Chico Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Chico, CA",
    lat: 39.729,
    lng: -121.837,
    max_capacity: 55,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 197,
    organization_id: 2,
    title: "Chico Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Butte County artists.",
    start_time: "2026-07-08 13:00:00",
    end_time: "2026-07-08 16:00:00",
    address: "Chico, CA",
    lat: 39.729,
    lng: -121.837,
    max_capacity: 456,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 198,
    organization_id: 3,
    title: "Chico Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-10-15 15:00:00",
    end_time: "2026-10-15 19:00:00",
    address: "Chico, CA",
    lat: 39.729,
    lng: -121.837,
    max_capacity: 77,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Chino, CA ---
  {
    id: 199,
    organization_id: 4,
    title: "Chino Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-10 11:00:00",
    end_time: "2026-04-10 13:00:00",
    address: "Chino, CA",
    lat: 34.0167,
    lng: -117.6844,
    max_capacity: 55,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 200,
    organization_id: 1,
    title: "Chino Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by San Bernardino County artists.",
    start_time: "2026-07-17 13:00:00",
    end_time: "2026-07-17 16:00:00",
    address: "Chino, CA",
    lat: 34.0167,
    lng: -117.6844,
    max_capacity: 396,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Chino Hills, CA ---
  {
    id: 201,
    organization_id: 2,
    title: "Chino Hills Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Chino Hills, CA",
    lat: 33.9859,
    lng: -117.7267,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 202,
    organization_id: 3,
    title: "Chino Hills Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Chino Hills's favorite dog park. Treats provided.",
    start_time: "2026-11-21 17:00:00",
    end_time: "2026-11-21 20:00:00",
    address: "Chino Hills, CA",
    lat: 33.9859,
    lng: -117.7267,
    max_capacity: 62,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Chowchilla, CA ---
  {
    id: 203,
    organization_id: 4,
    title: "Chowchilla Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Chowchilla, CA",
    lat: 37.1214,
    lng: -120.262,
    max_capacity: 337,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Chula Vista, CA ---
  {
    id: 204,
    organization_id: 1,
    title: "Chula Vista Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Chula Vista, CA",
    lat: 32.6428,
    lng: -117.0815,
    max_capacity: 477,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 205,
    organization_id: 2,
    title: "Chula Vista Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-21 11:00:00",
    end_time: "2026-05-21 14:00:00",
    address: "Chula Vista, CA",
    lat: 32.6428,
    lng: -117.0815,
    max_capacity: 578,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 206,
    organization_id: 3,
    title: "Chula Vista Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-01 13:00:00",
    end_time: "2026-08-01 17:00:00",
    address: "Chula Vista, CA",
    lat: 32.6428,
    lng: -117.0815,
    max_capacity: 99,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 207,
    organization_id: 4,
    title: "Chula Vista Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-08 15:00:00",
    end_time: "2026-11-08 17:00:00",
    address: "Chula Vista, CA",
    lat: 32.6428,
    lng: -117.0815,
    max_capacity: 80,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Citrus Heights, CA ---
  {
    id: 208,
    organization_id: 1,
    title: "Citrus Heights Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Sacramento County. Tasting tickets available at the gate.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Citrus Heights, CA",
    lat: 38.7022,
    lng: -121.2859,
    max_capacity: 501,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 209,
    organization_id: 2,
    title: "Citrus Heights Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-05-15 11:00:00",
    end_time: "2026-05-15 14:00:00",
    address: "Citrus Heights, CA",
    lat: 38.7022,
    lng: -121.2859,
    max_capacity: 142,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Claremont, CA ---
  {
    id: 210,
    organization_id: 3,
    title: "Claremont Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Claremont, CA",
    lat: 34.0928,
    lng: -117.7237,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Clayton, CA ---
  {
    id: 211,
    organization_id: 4,
    title: "Clayton Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-11 18:00:00",
    end_time: "2026-11-11 20:00:00",
    address: "Clayton, CA",
    lat: 37.9401,
    lng: -121.937,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Clearlake, CA ---
  {
    id: 212,
    organization_id: 1,
    title: "Clearlake Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Clearlake, CA",
    lat: 38.9558,
    lng: -122.6293,
    max_capacity: 234,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Cloverdale, CA ---
  {
    id: 213,
    organization_id: 2,
    title: "Cloverdale Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-09-03 16:00:00",
    end_time: "2026-09-03 18:00:00",
    address: "Cloverdale, CA",
    lat: 38.7961,
    lng: -123.0207,
    max_capacity: 712,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Clovis, CA ---
  {
    id: 214,
    organization_id: 3,
    title: "Clovis Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Clovis, CA",
    lat: 36.8213,
    lng: -119.7068,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 215,
    organization_id: 4,
    title: "Clovis Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Clovis's favorite dog park. Treats provided.",
    start_time: "2026-11-18 17:00:00",
    end_time: "2026-11-18 20:00:00",
    address: "Clovis, CA",
    lat: 36.8213,
    lng: -119.7068,
    max_capacity: 62,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 216,
    organization_id: 1,
    title: "Clovis Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-02-25 19:00:00",
    end_time: "2026-02-25 23:00:00",
    address: "Clovis, CA",
    lat: 36.8213,
    lng: -119.7068,
    max_capacity: 2813,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Coachella, CA ---
  {
    id: 217,
    organization_id: 2,
    title: "Coachella Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-05-02 12:00:00",
    end_time: "2026-05-02 14:00:00",
    address: "Coachella, CA",
    lat: 33.6801,
    lng: -116.174,
    max_capacity: 108,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Coalinga, CA ---
  {
    id: 218,
    organization_id: 3,
    title: "Coalinga Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-12 13:00:00",
    end_time: "2026-06-12 15:00:00",
    address: "Coalinga, CA",
    lat: 36.1361,
    lng: -120.3638,
    max_capacity: 417,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Colfax, CA ---
  {
    id: 219,
    organization_id: 4,
    title: "Colfax Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Colfax's favorite dog park. Treats provided.",
    start_time: "2026-07-13 14:00:00",
    end_time: "2026-07-13 16:00:00",
    address: "Colfax, CA",
    lat: 39.1055,
    lng: -120.9485,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Colma, CA ---
  {
    id: 220,
    organization_id: 1,
    title: "Colma Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-03 19:00:00",
    end_time: "2026-12-03 21:00:00",
    address: "Colma, CA",
    lat: 37.6706,
    lng: -122.4585,
    max_capacity: 75,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Colton, CA ---
  {
    id: 221,
    organization_id: 2,
    title: "Colton Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Colton, CA",
    lat: 34.0737,
    lng: -117.3138,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 222,
    organization_id: 3,
    title: "Colton Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-01 18:00:00",
    end_time: "2026-12-01 21:00:00",
    address: "Colton, CA",
    lat: 34.0737,
    lng: -117.3138,
    max_capacity: 49,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Colusa, CA ---
  {
    id: 223,
    organization_id: 4,
    title: "Colusa Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "Colusa, CA",
    lat: 39.2188,
    lng: -122.0032,
    max_capacity: 495,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Commerce, CA ---
  {
    id: 224,
    organization_id: 1,
    title: "Commerce Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Commerce, CA",
    lat: 34.0005,
    lng: -118.1512,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Compton, CA ---
  {
    id: 225,
    organization_id: 2,
    title: "Compton Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Compton, CA",
    lat: 33.8986,
    lng: -118.2173,
    max_capacity: 78,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 226,
    organization_id: 3,
    title: "Compton Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Compton, CA",
    lat: 33.8986,
    lng: -118.2173,
    max_capacity: 29,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Concord, CA ---
  {
    id: 227,
    organization_id: 4,
    title: "Concord Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-01-01 08:00:00",
    end_time: "2026-01-01 10:00:00",
    address: "Concord, CA",
    lat: 37.9825,
    lng: -122.0265,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 228,
    organization_id: 1,
    title: "Concord 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-04-08 10:00:00",
    end_time: "2026-04-08 13:00:00",
    address: "Concord, CA",
    lat: 37.9825,
    lng: -122.0265,
    max_capacity: 597,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 229,
    organization_id: 2,
    title: "Concord Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Concord. All paces welcome.",
    start_time: "2026-07-15 12:00:00",
    end_time: "2026-07-15 16:00:00",
    address: "Concord, CA",
    lat: 37.9825,
    lng: -122.0265,
    max_capacity: 78,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Corcoran, CA ---
  {
    id: 230,
    organization_id: 3,
    title: "Corcoran Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-07 08:00:00",
    end_time: "2026-01-07 10:00:00",
    address: "Corcoran, CA",
    lat: 36.0959,
    lng: -119.5625,
    max_capacity: 182,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Corning, CA ---
  {
    id: 231,
    organization_id: 4,
    title: "Corning Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Corning's favorite dog park. Treats provided.",
    start_time: "2026-11-08 18:00:00",
    end_time: "2026-11-08 20:00:00",
    address: "Corning, CA",
    lat: 39.9245,
    lng: -122.1826,
    max_capacity: 68,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Corona, CA ---
  {
    id: 232,
    organization_id: 1,
    title: "Corona Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Corona, CA",
    lat: 33.8766,
    lng: -117.5651,
    max_capacity: 163,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 233,
    organization_id: 2,
    title: "Corona Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-21 17:00:00",
    end_time: "2026-11-21 20:00:00",
    address: "Corona, CA",
    lat: 33.8766,
    lng: -117.5651,
    max_capacity: 264,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 234,
    organization_id: 3,
    title: "Corona Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-01 19:00:00",
    end_time: "2026-02-01 23:00:00",
    address: "Corona, CA",
    lat: 33.8766,
    lng: -117.5651,
    max_capacity: 265,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Coronado, CA ---
  {
    id: 235,
    organization_id: 4,
    title: "Coronado Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-13 14:00:00",
    end_time: "2026-07-13 16:00:00",
    address: "Coronado, CA",
    lat: 32.6839,
    lng: -117.1851,
    max_capacity: 230,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Corte Madera, CA ---
  {
    id: 236,
    organization_id: 1,
    title: "Corte Madera Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Corte Madera, CA",
    lat: 37.9248,
    lng: -122.525,
    max_capacity: 1244,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Costa Mesa, CA ---
  {
    id: 237,
    organization_id: 2,
    title: "Costa Mesa Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-12-15 19:00:00",
    end_time: "2026-12-15 21:00:00",
    address: "Costa Mesa, CA",
    lat: 33.646,
    lng: -117.9138,
    max_capacity: 599,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 238,
    organization_id: 3,
    title: "Costa Mesa Half Marathon",
    description:
      "A scenic half marathon through the heart of Costa Mesa. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-22 09:00:00",
    end_time: "2026-03-22 12:00:00",
    address: "Costa Mesa, CA",
    lat: 33.646,
    lng: -117.9138,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 239,
    organization_id: 4,
    title: "Costa Mesa Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-02 11:00:00",
    end_time: "2026-06-02 15:00:00",
    address: "Costa Mesa, CA",
    lat: 33.646,
    lng: -117.9138,
    max_capacity: 501,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Cotati, CA ---
  {
    id: 240,
    organization_id: 1,
    title: "Cotati Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-18 19:00:00",
    end_time: "2026-12-18 21:00:00",
    address: "Cotati, CA",
    lat: 38.3287,
    lng: -122.7072,
    max_capacity: 75,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Covina, CA ---
  {
    id: 241,
    organization_id: 2,
    title: "Covina Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Covina. All paces welcome.",
    start_time: "2026-03-27 10:00:00",
    end_time: "2026-03-27 12:00:00",
    address: "Covina, CA",
    lat: 34.088,
    lng: -117.8923,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 242,
    organization_id: 3,
    title: "Covina Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-07 12:00:00",
    end_time: "2026-06-07 15:00:00",
    address: "Covina, CA",
    lat: 34.088,
    lng: -117.8923,
    max_capacity: 331,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Crescent City, CA ---
  {
    id: 243,
    organization_id: 4,
    title: "Crescent City Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-16 11:00:00",
    end_time: "2026-04-16 13:00:00",
    address: "Crescent City, CA",
    lat: 41.7559,
    lng: -124.2025,
    max_capacity: 251,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Cudahy, CA ---
  {
    id: 244,
    organization_id: 1,
    title: "Cudahy Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-11 12:00:00",
    end_time: "2026-05-11 14:00:00",
    address: "Cudahy, CA",
    lat: 33.9651,
    lng: -118.1822,
    max_capacity: 584,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Culver City, CA ---
  {
    id: 245,
    organization_id: 2,
    title: "Culver City Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-20 15:00:00",
    end_time: "2026-08-20 17:00:00",
    address: "Culver City, CA",
    lat: 34.0216,
    lng: -118.396,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Cupertino, CA ---
  {
    id: 246,
    organization_id: 3,
    title: "Cupertino Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Cupertino's favorite dog park. Treats provided.",
    start_time: "2026-11-11 18:00:00",
    end_time: "2026-11-11 20:00:00",
    address: "Cupertino, CA",
    lat: 37.3238,
    lng: -122.0314,
    max_capacity: 108,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 247,
    organization_id: 4,
    title: "Cupertino Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-02-18 08:00:00",
    end_time: "2026-02-18 11:00:00",
    address: "Cupertino, CA",
    lat: 37.3238,
    lng: -122.0314,
    max_capacity: 1559,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Cypress, CA ---
  {
    id: 248,
    organization_id: 1,
    title: "Cypress Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-11-11 18:00:00",
    end_time: "2026-11-11 20:00:00",
    address: "Cypress, CA",
    lat: 33.8173,
    lng: -118.0369,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 249,
    organization_id: 2,
    title: "Cypress Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Orange County. Tasting tickets available at the gate.",
    start_time: "2026-02-18 08:00:00",
    end_time: "2026-02-18 11:00:00",
    address: "Cypress, CA",
    lat: 33.8173,
    lng: -118.0369,
    max_capacity: 955,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Daly City, CA ---
  {
    id: 250,
    organization_id: 3,
    title: "Daly City Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Daly City, CA",
    lat: 37.6842,
    lng: -122.4739,
    max_capacity: 113,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 251,
    organization_id: 4,
    title: "Daly City Trail Run",
    description:
      "Scenic trail run through open spaces near Daly City. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-21 11:00:00",
    end_time: "2026-05-21 14:00:00",
    address: "Daly City, CA",
    lat: 37.6842,
    lng: -122.4739,
    max_capacity: 114,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 252,
    organization_id: 1,
    title: "Daly City Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-01 13:00:00",
    end_time: "2026-08-01 17:00:00",
    address: "Daly City, CA",
    lat: 37.6842,
    lng: -122.4739,
    max_capacity: 1815,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Dana Point, CA ---
  {
    id: 253,
    organization_id: 2,
    title: "Dana Point Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-05-26 12:00:00",
    end_time: "2026-05-26 14:00:00",
    address: "Dana Point, CA",
    lat: 33.4651,
    lng: -117.6999,
    max_capacity: 432,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Danville, CA ---
  {
    id: 254,
    organization_id: 3,
    title: "Danville Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-06-03 13:00:00",
    end_time: "2026-06-03 15:00:00",
    address: "Danville, CA",
    lat: 37.8261,
    lng: -121.9956,
    max_capacity: 193,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Davis, CA ---
  {
    id: 255,
    organization_id: 4,
    title: "Davis Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Davis. All skill levels welcome.",
    start_time: "2026-04-13 11:00:00",
    end_time: "2026-04-13 13:00:00",
    address: "Davis, CA",
    lat: 38.5406,
    lng: -121.7448,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 256,
    organization_id: 1,
    title: "Davis Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-20 13:00:00",
    end_time: "2026-07-20 16:00:00",
    address: "Davis, CA",
    lat: 38.5406,
    lng: -121.7448,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Del Mar, CA ---
  {
    id: 257,
    organization_id: 2,
    title: "Del Mar Trail Run",
    description:
      "Scenic trail run through open spaces near Del Mar. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-15 16:00:00",
    end_time: "2026-09-15 18:00:00",
    address: "Del Mar, CA",
    lat: 32.9625,
    lng: -117.2623,
    max_capacity: 180,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Del Rey Oaks, CA ---
  {
    id: 258,
    organization_id: 3,
    title: "Del Rey Oaks Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-02 12:00:00",
    end_time: "2026-05-02 14:00:00",
    address: "Del Rey Oaks, CA",
    lat: 36.6027,
    lng: -121.8341,
    max_capacity: 192,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Delano, CA ---
  {
    id: 259,
    organization_id: 4,
    title: "Delano Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Delano, CA",
    lat: 35.7729,
    lng: -119.2429,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 260,
    organization_id: 1,
    title: "Delano Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Delano's favorite dog park. Treats provided.",
    start_time: "2026-07-14 13:00:00",
    end_time: "2026-07-14 16:00:00",
    address: "Delano, CA",
    lat: 35.7729,
    lng: -119.2429,
    max_capacity: 142,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Desert Hot Springs, CA ---
  {
    id: 261,
    organization_id: 2,
    title: "Desert Hot Springs Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-20 15:00:00",
    end_time: "2026-08-20 17:00:00",
    address: "Desert Hot Springs, CA",
    lat: 33.9628,
    lng: -116.4997,
    max_capacity: 1467,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Diamond Bar, CA ---
  {
    id: 262,
    organization_id: 3,
    title: "Diamond Bar Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-09-12 16:00:00",
    end_time: "2026-09-12 18:00:00",
    address: "Diamond Bar, CA",
    lat: 34.0304,
    lng: -117.8085,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 263,
    organization_id: 4,
    title: "Diamond Bar Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-12-19 18:00:00",
    end_time: "2026-12-19 21:00:00",
    address: "Diamond Bar, CA",
    lat: 34.0304,
    lng: -117.8085,
    max_capacity: 369,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Dinuba, CA ---
  {
    id: 264,
    organization_id: 1,
    title: "Dinuba Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Dinuba. All paces welcome.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Dinuba, CA",
    lat: 36.5387,
    lng: -119.3914,
    max_capacity: 40,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Dixon, CA ---
  {
    id: 265,
    organization_id: 2,
    title: "Dixon Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-15 16:00:00",
    end_time: "2026-09-15 18:00:00",
    address: "Dixon, CA",
    lat: 38.4431,
    lng: -121.8253,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Dorris, CA ---
  {
    id: 266,
    organization_id: 3,
    title: "Dorris Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-09-09 16:00:00",
    end_time: "2026-09-09 18:00:00",
    address: "Dorris, CA",
    lat: 41.9644,
    lng: -121.9154,
    max_capacity: 86,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Dos Palos, CA ---
  {
    id: 267,
    organization_id: 4,
    title: "Dos Palos Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-24 16:00:00",
    end_time: "2026-09-24 18:00:00",
    address: "Dos Palos, CA",
    lat: 36.9851,
    lng: -120.6275,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Downey, CA ---
  {
    id: 268,
    organization_id: 1,
    title: "Downey Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Downey, CA",
    lat: 33.9366,
    lng: -118.1367,
    max_capacity: 415,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 269,
    organization_id: 2,
    title: "Downey Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-14 13:00:00",
    end_time: "2026-07-14 16:00:00",
    address: "Downey, CA",
    lat: 33.9366,
    lng: -118.1367,
    max_capacity: 36,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 270,
    organization_id: 3,
    title: "Downey Multicultural Festival",
    description:
      "A celebration of Downey's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-21 15:00:00",
    end_time: "2026-10-21 19:00:00",
    address: "Downey, CA",
    lat: 33.9366,
    lng: -118.1367,
    max_capacity: 1017,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Duarte, CA ---
  {
    id: 271,
    organization_id: 4,
    title: "Duarte Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-10 14:00:00",
    end_time: "2026-07-10 16:00:00",
    address: "Duarte, CA",
    lat: 34.1426,
    lng: -117.9741,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Dublin, CA ---
  {
    id: 272,
    organization_id: 1,
    title: "Dublin Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Alameda County artists.",
    start_time: "2026-11-11 18:00:00",
    end_time: "2026-11-11 20:00:00",
    address: "Dublin, CA",
    lat: 37.7053,
    lng: -121.9326,
    max_capacity: 282,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 273,
    organization_id: 2,
    title: "Dublin Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-18 08:00:00",
    end_time: "2026-02-18 11:00:00",
    address: "Dublin, CA",
    lat: 37.7053,
    lng: -121.9326,
    max_capacity: 83,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Dunsmuir, CA ---
  {
    id: 274,
    organization_id: 3,
    title: "Dunsmuir Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Siskiyou County artists.",
    start_time: "2026-03-06 10:00:00",
    end_time: "2026-03-06 12:00:00",
    address: "Dunsmuir, CA",
    lat: 41.2122,
    lng: -122.2712,
    max_capacity: 262,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- East Palo Alto, CA ---
  {
    id: 275,
    organization_id: 4,
    title: "East Palo Alto Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-06 19:00:00",
    end_time: "2026-12-06 21:00:00",
    address: "East Palo Alto, CA",
    lat: 37.4649,
    lng: -122.145,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Eastvale, CA ---
  {
    id: 276,
    organization_id: 1,
    title: "Eastvale Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Eastvale, CA",
    lat: 33.9566,
    lng: -117.5773,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 277,
    organization_id: 2,
    title: "Eastvale Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Eastvale's favorite dog park. Treats provided.",
    start_time: "2026-11-12 17:00:00",
    end_time: "2026-11-12 20:00:00",
    address: "Eastvale, CA",
    lat: 33.9566,
    lng: -117.5773,
    max_capacity: 142,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- El Cajon, CA ---
  {
    id: 278,
    organization_id: 3,
    title: "El Cajon Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "El Cajon, CA",
    lat: 32.7953,
    lng: -116.962,
    max_capacity: 255,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 279,
    organization_id: 4,
    title: "El Cajon Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-18 17:00:00",
    end_time: "2026-11-18 20:00:00",
    address: "El Cajon, CA",
    lat: 32.7953,
    lng: -116.962,
    max_capacity: 36,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 280,
    organization_id: 1,
    title: "El Cajon Multicultural Festival",
    description:
      "A celebration of El Cajon's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-25 19:00:00",
    end_time: "2026-02-25 23:00:00",
    address: "El Cajon, CA",
    lat: 32.7953,
    lng: -116.962,
    max_capacity: 1857,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- El Centro, CA ---
  {
    id: 281,
    organization_id: 2,
    title: "El Centro Trail Run",
    description:
      "Scenic trail run through open spaces near El Centro. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-14 12:00:00",
    end_time: "2026-05-14 14:00:00",
    address: "El Centro, CA",
    lat: 32.795,
    lng: -115.5601,
    max_capacity: 380,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- El Cerrito, CA ---
  {
    id: 282,
    organization_id: 3,
    title: "El Cerrito Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "El Cerrito, CA",
    lat: 37.9255,
    lng: -122.316,
    max_capacity: 1367,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- El Monte, CA ---
  {
    id: 283,
    organization_id: 4,
    title: "El Monte Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "El Monte, CA",
    lat: 34.0673,
    lng: -118.0289,
    max_capacity: 437,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 284,
    organization_id: 1,
    title: "El Monte Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-01 15:00:00",
    end_time: "2026-09-01 18:00:00",
    address: "El Monte, CA",
    lat: 34.0673,
    lng: -118.0289,
    max_capacity: 638,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 285,
    organization_id: 2,
    title: "El Monte Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-12-08 17:00:00",
    end_time: "2026-12-08 21:00:00",
    address: "El Monte, CA",
    lat: 34.0673,
    lng: -118.0289,
    max_capacity: 139,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- El Segundo, CA ---
  {
    id: 286,
    organization_id: 3,
    title: "El Segundo Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-11 09:00:00",
    end_time: "2026-02-11 11:00:00",
    address: "El Segundo, CA",
    lat: 33.9203,
    lng: -118.4154,
    max_capacity: 61,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Elk Grove, CA ---
  {
    id: 287,
    organization_id: 4,
    title: "Elk Grove Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Elk Grove, CA",
    lat: 38.4096,
    lng: -121.3708,
    max_capacity: 58,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 288,
    organization_id: 1,
    title: "Elk Grove Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Elk Grove, CA",
    lat: 38.4096,
    lng: -121.3708,
    max_capacity: 29,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 289,
    organization_id: 2,
    title: "Elk Grove Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-05-07 10:00:00",
    end_time: "2026-05-07 14:00:00",
    address: "Elk Grove, CA",
    lat: 38.4096,
    lng: -121.3708,
    max_capacity: 260,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Emeryville, CA ---
  {
    id: 290,
    organization_id: 3,
    title: "Emeryville Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Alameda County artists.",
    start_time: "2026-07-04 14:00:00",
    end_time: "2026-07-04 16:00:00",
    address: "Emeryville, CA",
    lat: 37.8263,
    lng: -122.2902,
    max_capacity: 302,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Encinitas, CA ---
  {
    id: 291,
    organization_id: 4,
    title: "Encinitas Half Marathon",
    description:
      "A scenic half marathon through the heart of Encinitas. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Encinitas, CA",
    lat: 33.0405,
    lng: -117.2884,
    max_capacity: 886,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 292,
    organization_id: 1,
    title: "Encinitas Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-16 12:00:00",
    end_time: "2026-06-16 15:00:00",
    address: "Encinitas, CA",
    lat: 33.0405,
    lng: -117.2884,
    max_capacity: 987,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Escalon, CA ---
  {
    id: 293,
    organization_id: 2,
    title: "Escalon Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "Escalon, CA",
    lat: 37.7967,
    lng: -121.0006,
    max_capacity: 193,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Escondido, CA ---
  {
    id: 294,
    organization_id: 3,
    title: "Escondido Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-16 11:00:00",
    end_time: "2026-04-16 13:00:00",
    address: "Escondido, CA",
    lat: 33.1157,
    lng: -117.0899,
    max_capacity: 415,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 295,
    organization_id: 4,
    title: "Escondido Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-23 13:00:00",
    end_time: "2026-07-23 16:00:00",
    address: "Escondido, CA",
    lat: 33.1157,
    lng: -117.0899,
    max_capacity: 36,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 296,
    organization_id: 1,
    title: "Escondido Multicultural Festival",
    description:
      "A celebration of Escondido's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-03 15:00:00",
    end_time: "2026-10-03 19:00:00",
    address: "Escondido, CA",
    lat: 33.1157,
    lng: -117.0899,
    max_capacity: 1417,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Etna, CA ---
  {
    id: 297,
    organization_id: 2,
    title: "Etna Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Siskiyou County artists.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Etna, CA",
    lat: 41.4603,
    lng: -122.8962,
    max_capacity: 282,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Eureka, CA ---
  {
    id: 298,
    organization_id: 3,
    title: "Eureka Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Eureka, CA",
    lat: 40.7974,
    lng: -124.1684,
    max_capacity: 253,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Exeter, CA ---
  {
    id: 299,
    organization_id: 4,
    title: "Exeter Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-09-18 16:00:00",
    end_time: "2026-09-18 18:00:00",
    address: "Exeter, CA",
    lat: 36.2984,
    lng: -119.1406,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Fairfax, CA ---
  {
    id: 300,
    organization_id: 1,
    title: "Fairfax Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "Fairfax, CA",
    lat: 37.9872,
    lng: -122.5885,
    max_capacity: 251,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Fairfield, CA ---
  {
    id: 301,
    organization_id: 2,
    title: "Fairfield Multicultural Festival",
    description:
      "A celebration of Fairfield's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Fairfield, CA",
    lat: 38.2512,
    lng: -122.0378,
    max_capacity: 969,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 302,
    organization_id: 3,
    title: "Fairfield Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-21 11:00:00",
    end_time: "2026-05-21 14:00:00",
    address: "Fairfield, CA",
    lat: 38.2512,
    lng: -122.0378,
    max_capacity: 110,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 303,
    organization_id: 4,
    title: "Fairfield 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-01 13:00:00",
    end_time: "2026-08-01 17:00:00",
    address: "Fairfield, CA",
    lat: 38.2512,
    lng: -122.0378,
    max_capacity: 671,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Farmersville, CA ---
  {
    id: 304,
    organization_id: 1,
    title: "Farmersville Trail Run",
    description:
      "Scenic trail run through open spaces near Farmersville. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Farmersville, CA",
    lat: 36.3003,
    lng: -119.208,
    max_capacity: 260,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Ferndale, CA ---
  {
    id: 305,
    organization_id: 2,
    title: "Ferndale Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Ferndale, CA",
    lat: 40.5809,
    lng: -124.2605,
    max_capacity: 799,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Fillmore, CA ---
  {
    id: 306,
    organization_id: 3,
    title: "Fillmore Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-25 11:00:00",
    end_time: "2026-04-25 13:00:00",
    address: "Fillmore, CA",
    lat: 34.3998,
    lng: -118.9177,
    max_capacity: 251,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Firebaugh, CA ---
  {
    id: 307,
    organization_id: 4,
    title: "Firebaugh Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Firebaugh, CA",
    lat: 36.8577,
    lng: -120.4616,
    max_capacity: 111,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Folsom, CA ---
  {
    id: 308,
    organization_id: 1,
    title: "Folsom Half Marathon",
    description:
      "A scenic half marathon through the heart of Folsom. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Folsom, CA",
    lat: 38.6776,
    lng: -121.1765,
    max_capacity: 1846,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 309,
    organization_id: 2,
    title: "Folsom Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-04 12:00:00",
    end_time: "2026-06-04 15:00:00",
    address: "Folsom, CA",
    lat: 38.6776,
    lng: -121.1765,
    max_capacity: 1447,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Fontana, CA ---
  {
    id: 310,
    organization_id: 3,
    title: "Fontana Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Fontana, CA",
    lat: 34.0928,
    lng: -117.4344,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 311,
    organization_id: 4,
    title: "Fontana Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-03 14:00:00",
    end_time: "2026-08-03 17:00:00",
    address: "Fontana, CA",
    lat: 34.0928,
    lng: -117.4344,
    max_capacity: 407,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 312,
    organization_id: 1,
    title: "Fontana Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-10 16:00:00",
    end_time: "2026-11-10 20:00:00",
    address: "Fontana, CA",
    lat: 34.0928,
    lng: -117.4344,
    max_capacity: 258,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 313,
    organization_id: 2,
    title: "Fontana Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-17 18:00:00",
    end_time: "2026-02-17 20:00:00",
    address: "Fontana, CA",
    lat: 34.0928,
    lng: -117.4344,
    max_capacity: 259,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Fort Bragg, CA ---
  {
    id: 314,
    organization_id: 3,
    title: "Fort Bragg Multicultural Festival",
    description:
      "A celebration of Fort Bragg's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Fort Bragg, CA",
    lat: 39.4416,
    lng: -123.8094,
    max_capacity: 809,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Fort Jones, CA ---
  {
    id: 315,
    organization_id: 4,
    title: "Fort Jones Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-06 10:00:00",
    end_time: "2026-03-06 12:00:00",
    address: "Fort Jones, CA",
    lat: 41.6097,
    lng: -122.8396,
    max_capacity: 270,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Fortuna, CA ---
  {
    id: 316,
    organization_id: 1,
    title: "Fortuna Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-01 17:00:00",
    end_time: "2026-10-01 19:00:00",
    address: "Fortuna, CA",
    lat: 40.6009,
    lng: -124.1546,
    max_capacity: 477,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Foster City, CA ---
  {
    id: 317,
    organization_id: 2,
    title: "Foster City Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-07 17:00:00",
    end_time: "2026-10-07 19:00:00",
    address: "Foster City, CA",
    lat: 37.554,
    lng: -122.2756,
    max_capacity: 15,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Fountain Valley, CA ---
  {
    id: 318,
    organization_id: 3,
    title: "Fountain Valley Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-10-01 17:00:00",
    end_time: "2026-10-01 19:00:00",
    address: "Fountain Valley, CA",
    lat: 33.7111,
    lng: -117.9517,
    max_capacity: 69,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 319,
    organization_id: 4,
    title: "Fountain Valley Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-01-08 19:00:00",
    end_time: "2026-01-08 22:00:00",
    address: "Fountain Valley, CA",
    lat: 33.7111,
    lng: -117.9517,
    max_capacity: 130,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Fowler, CA ---
  {
    id: 320,
    organization_id: 1,
    title: "Fowler Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-08 15:00:00",
    end_time: "2026-08-08 17:00:00",
    address: "Fowler, CA",
    lat: 36.6299,
    lng: -119.6788,
    max_capacity: 647,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Fremont, CA ---
  {
    id: 321,
    organization_id: 2,
    title: "Fremont Half Marathon",
    description:
      "A scenic half marathon through the heart of Fremont. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-15 10:00:00",
    end_time: "2026-03-15 12:00:00",
    address: "Fremont, CA",
    lat: 37.5521,
    lng: -121.985,
    max_capacity: 1786,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 322,
    organization_id: 3,
    title: "Fremont Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-22 12:00:00",
    end_time: "2026-06-22 15:00:00",
    address: "Fremont, CA",
    lat: 37.5521,
    lng: -121.985,
    max_capacity: 787,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 323,
    organization_id: 4,
    title: "Fremont Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-02 14:00:00",
    end_time: "2026-09-02 18:00:00",
    address: "Fremont, CA",
    lat: 37.5521,
    lng: -121.985,
    max_capacity: 888,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 324,
    organization_id: 1,
    title: "Fremont Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Fremont. All skill levels welcome.",
    start_time: "2026-12-09 16:00:00",
    end_time: "2026-12-09 18:00:00",
    address: "Fremont, CA",
    lat: 37.5521,
    lng: -121.985,
    max_capacity: 29,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Fresno, CA ---
  {
    id: 325,
    organization_id: 2,
    title: "Fresno Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-17 15:00:00",
    end_time: "2026-08-17 17:00:00",
    address: "Fresno, CA",
    lat: 36.7367,
    lng: -119.7882,
    max_capacity: 439,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 326,
    organization_id: 3,
    title: "Fresno Half Marathon",
    description:
      "A scenic half marathon through the heart of Fresno. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-24 17:00:00",
    end_time: "2026-11-24 20:00:00",
    address: "Fresno, CA",
    lat: 36.7367,
    lng: -119.7882,
    max_capacity: 1840,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 327,
    organization_id: 4,
    title: "Fresno Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-02-04 19:00:00",
    end_time: "2026-02-04 23:00:00",
    address: "Fresno, CA",
    lat: 36.7367,
    lng: -119.7882,
    max_capacity: 841,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 328,
    organization_id: 1,
    title: "Fresno Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-05-11 09:00:00",
    end_time: "2026-05-11 11:00:00",
    address: "Fresno, CA",
    lat: 36.7367,
    lng: -119.7882,
    max_capacity: 942,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 329,
    organization_id: 2,
    title: "Fresno Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Fresno. All skill levels welcome.",
    start_time: "2026-08-18 11:00:00",
    end_time: "2026-08-18 14:00:00",
    address: "Fresno, CA",
    lat: 36.7367,
    lng: -119.7882,
    max_capacity: 23,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Fullerton, CA ---
  {
    id: 330,
    organization_id: 3,
    title: "Fullerton Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "Fullerton, CA",
    lat: 33.8711,
    lng: -117.9235,
    max_capacity: 257,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 331,
    organization_id: 4,
    title: "Fullerton Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-01 15:00:00",
    end_time: "2026-09-01 18:00:00",
    address: "Fullerton, CA",
    lat: 33.8711,
    lng: -117.9235,
    max_capacity: 38,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 332,
    organization_id: 1,
    title: "Fullerton Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-08 17:00:00",
    end_time: "2026-12-08 21:00:00",
    address: "Fullerton, CA",
    lat: 33.8711,
    lng: -117.9235,
    max_capacity: 159,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Galt, CA ---
  {
    id: 333,
    organization_id: 2,
    title: "Galt Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Galt, CA",
    lat: 38.2564,
    lng: -121.2973,
    max_capacity: 473,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Garden Grove, CA ---
  {
    id: 334,
    organization_id: 3,
    title: "Garden Grove Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-02-05 09:00:00",
    end_time: "2026-02-05 11:00:00",
    address: "Garden Grove, CA",
    lat: 33.7718,
    lng: -117.9403,
    max_capacity: 2325,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 335,
    organization_id: 4,
    title: "Garden Grove Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-12 11:00:00",
    end_time: "2026-05-12 14:00:00",
    address: "Garden Grove, CA",
    lat: 33.7718,
    lng: -117.9403,
    max_capacity: 76,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 336,
    organization_id: 1,
    title: "Garden Grove Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-19 13:00:00",
    end_time: "2026-08-19 17:00:00",
    address: "Garden Grove, CA",
    lat: 33.7718,
    lng: -117.9403,
    max_capacity: 627,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Gardena, CA ---
  {
    id: 337,
    organization_id: 2,
    title: "Gardena Trail Run",
    description:
      "Scenic trail run through open spaces near Gardena. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-11 12:00:00",
    end_time: "2026-05-11 14:00:00",
    address: "Gardena, CA",
    lat: 33.8893,
    lng: -118.3079,
    max_capacity: 260,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 338,
    organization_id: 3,
    title: "Gardena Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-18 14:00:00",
    end_time: "2026-08-18 17:00:00",
    address: "Gardena, CA",
    lat: 33.8893,
    lng: -118.3079,
    max_capacity: 1461,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Gilroy, CA ---
  {
    id: 339,
    organization_id: 4,
    title: "Gilroy Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-25 17:00:00",
    end_time: "2026-10-25 19:00:00",
    address: "Gilroy, CA",
    lat: 37.0041,
    lng: -121.57,
    max_capacity: 233,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 340,
    organization_id: 1,
    title: "Gilroy Trail Run",
    description:
      "Scenic trail run through open spaces near Gilroy. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-05 19:00:00",
    end_time: "2026-01-05 22:00:00",
    address: "Gilroy, CA",
    lat: 37.0041,
    lng: -121.57,
    max_capacity: 134,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Glendale, CA ---
  {
    id: 341,
    organization_id: 2,
    title: "Glendale Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-08 12:00:00",
    end_time: "2026-05-08 14:00:00",
    address: "Glendale, CA",
    lat: 34.1383,
    lng: -118.2593,
    max_capacity: 168,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 342,
    organization_id: 3,
    title: "Glendale Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-08-15 14:00:00",
    end_time: "2026-08-15 17:00:00",
    address: "Glendale, CA",
    lat: 34.1383,
    lng: -118.2593,
    max_capacity: 409,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 343,
    organization_id: 4,
    title: "Glendale Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-22 16:00:00",
    end_time: "2026-11-22 20:00:00",
    address: "Glendale, CA",
    lat: 34.1383,
    lng: -118.2593,
    max_capacity: 30,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Glendora, CA ---
  {
    id: 344,
    organization_id: 1,
    title: "Glendora Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Glendora, CA",
    lat: 34.1366,
    lng: -117.8648,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 345,
    organization_id: 2,
    title: "Glendora Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Los Angeles County artists.",
    start_time: "2026-11-18 17:00:00",
    end_time: "2026-11-18 20:00:00",
    address: "Glendora, CA",
    lat: 34.1366,
    lng: -117.8648,
    max_capacity: 256,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Goleta, CA ---
  {
    id: 346,
    organization_id: 3,
    title: "Goleta Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-01 14:00:00",
    end_time: "2026-07-01 16:00:00",
    address: "Goleta, CA",
    lat: 34.4405,
    lng: -119.8232,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Gonzales, CA ---
  {
    id: 347,
    organization_id: 4,
    title: "Gonzales Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-01-25 08:00:00",
    end_time: "2026-01-25 10:00:00",
    address: "Gonzales, CA",
    lat: 36.5134,
    lng: -121.4387,
    max_capacity: 66,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Grand Terrace, CA ---
  {
    id: 348,
    organization_id: 1,
    title: "Grand Terrace Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-06 19:00:00",
    end_time: "2026-12-06 21:00:00",
    address: "Grand Terrace, CA",
    lat: 34.0358,
    lng: -117.309,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Grass Valley, CA ---
  {
    id: 349,
    organization_id: 2,
    title: "Grass Valley Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-04-04 11:00:00",
    end_time: "2026-04-04 13:00:00",
    address: "Grass Valley, CA",
    lat: 39.2188,
    lng: -121.0611,
    max_capacity: 1247,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Greenfield, CA ---
  {
    id: 350,
    organization_id: 3,
    title: "Greenfield Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "Greenfield, CA",
    lat: 36.3222,
    lng: -121.243,
    max_capacity: 853,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Gridley, CA ---
  {
    id: 351,
    organization_id: 4,
    title: "Gridley Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Butte County artists.",
    start_time: "2026-03-03 10:00:00",
    end_time: "2026-03-03 12:00:00",
    address: "Gridley, CA",
    lat: 39.363,
    lng: -121.6924,
    max_capacity: 442,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Grover Beach, CA ---
  {
    id: 352,
    organization_id: 1,
    title: "Grover Beach Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-23 15:00:00",
    end_time: "2026-08-23 17:00:00",
    address: "Grover Beach, CA",
    lat: 35.1268,
    lng: -120.6169,
    max_capacity: 799,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Guadalupe, CA ---
  {
    id: 353,
    organization_id: 2,
    title: "Guadalupe Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-06 10:00:00",
    end_time: "2026-03-06 12:00:00",
    address: "Guadalupe, CA",
    lat: 34.9752,
    lng: -120.5663,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Gustine, CA ---
  {
    id: 354,
    organization_id: 3,
    title: "Gustine Trail Run",
    description:
      "Scenic trail run through open spaces near Gustine. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-25 08:00:00",
    end_time: "2026-01-25 10:00:00",
    address: "Gustine, CA",
    lat: 37.2593,
    lng: -120.9958,
    max_capacity: 280,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Half Moon Bay, CA ---
  {
    id: 355,
    organization_id: 4,
    title: "Half Moon Bay Multicultural Festival",
    description:
      "A celebration of Half Moon Bay's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-16 17:00:00",
    end_time: "2026-10-16 19:00:00",
    address: "Half Moon Bay, CA",
    lat: 37.4655,
    lng: -122.4267,
    max_capacity: 1969,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Hanford, CA ---
  {
    id: 356,
    organization_id: 1,
    title: "Hanford Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-10-25 17:00:00",
    end_time: "2026-10-25 19:00:00",
    address: "Hanford, CA",
    lat: 36.3269,
    lng: -119.6462,
    max_capacity: 745,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 357,
    organization_id: 2,
    title: "Hanford Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-05 19:00:00",
    end_time: "2026-01-05 22:00:00",
    address: "Hanford, CA",
    lat: 36.3269,
    lng: -119.6462,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Hawaiian Gardens, CA ---
  {
    id: 358,
    organization_id: 3,
    title: "Hawaiian Gardens Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-12 16:00:00",
    end_time: "2026-09-12 18:00:00",
    address: "Hawaiian Gardens, CA",
    lat: 33.8279,
    lng: -118.0755,
    max_capacity: 720,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Hawthorne, CA ---
  {
    id: 359,
    organization_id: 4,
    title: "Hawthorne Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Hawthorne. All paces welcome.",
    start_time: "2026-03-03 10:00:00",
    end_time: "2026-03-03 12:00:00",
    address: "Hawthorne, CA",
    lat: 33.9184,
    lng: -118.3506,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 360,
    organization_id: 1,
    title: "Hawthorne Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-10 12:00:00",
    end_time: "2026-06-10 15:00:00",
    address: "Hawthorne, CA",
    lat: 33.9184,
    lng: -118.3506,
    max_capacity: 371,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Hayward, CA ---
  {
    id: 361,
    organization_id: 2,
    title: "Hayward Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Hayward, CA",
    lat: 37.6692,
    lng: -122.0804,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 362,
    organization_id: 3,
    title: "Hayward Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Alameda County. Tasting tickets available at the gate.",
    start_time: "2026-06-04 12:00:00",
    end_time: "2026-06-04 15:00:00",
    address: "Hayward, CA",
    lat: 37.6692,
    lng: -122.0804,
    max_capacity: 1955,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 363,
    organization_id: 4,
    title: "Hayward Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-11 14:00:00",
    end_time: "2026-09-11 18:00:00",
    address: "Hayward, CA",
    lat: 37.6692,
    lng: -122.0804,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Healdsburg, CA ---
  {
    id: 364,
    organization_id: 1,
    title: "Healdsburg Multicultural Festival",
    description:
      "A celebration of Healdsburg's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Healdsburg, CA",
    lat: 38.6101,
    lng: -122.8692,
    max_capacity: 2949,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Hemet, CA ---
  {
    id: 365,
    organization_id: 2,
    title: "Hemet Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-17 09:00:00",
    end_time: "2026-02-17 11:00:00",
    address: "Hemet, CA",
    lat: 33.7426,
    lng: -116.9768,
    max_capacity: 121,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 366,
    organization_id: 3,
    title: "Hemet Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-24 11:00:00",
    end_time: "2026-05-24 14:00:00",
    address: "Hemet, CA",
    lat: 33.7426,
    lng: -116.9768,
    max_capacity: 82,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Hercules, CA ---
  {
    id: 367,
    organization_id: 4,
    title: "Hercules Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Hercules, CA",
    lat: 38.0031,
    lng: -122.2859,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Hermosa Beach, CA ---
  {
    id: 368,
    organization_id: 1,
    title: "Hermosa Beach Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-18 13:00:00",
    end_time: "2026-06-18 15:00:00",
    address: "Hermosa Beach, CA",
    lat: 33.8657,
    lng: -118.396,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Hesperia, CA ---
  {
    id: 369,
    organization_id: 2,
    title: "Hesperia Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-17 09:00:00",
    end_time: "2026-02-17 11:00:00",
    address: "Hesperia, CA",
    lat: 34.4303,
    lng: -117.297,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 370,
    organization_id: 3,
    title: "Hesperia Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-24 11:00:00",
    end_time: "2026-05-24 14:00:00",
    address: "Hesperia, CA",
    lat: 34.4303,
    lng: -117.297,
    max_capacity: 230,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Hidden Hills, CA ---
  {
    id: 371,
    organization_id: 4,
    title: "Hidden Hills Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Hidden Hills. All skill levels welcome.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "Hidden Hills, CA",
    lat: 34.1533,
    lng: -118.6629,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Highland, CA ---
  {
    id: 372,
    organization_id: 1,
    title: "Highland Multicultural Festival",
    description:
      "A celebration of Highland's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-24 13:00:00",
    end_time: "2026-06-24 15:00:00",
    address: "Highland, CA",
    lat: 34.132,
    lng: -117.2047,
    max_capacity: 889,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 373,
    organization_id: 2,
    title: "Highland Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-09-04 15:00:00",
    end_time: "2026-09-04 18:00:00",
    address: "Highland, CA",
    lat: 34.132,
    lng: -117.2047,
    max_capacity: 120,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Hillsborough, CA ---
  {
    id: 374,
    organization_id: 3,
    title: "Hillsborough Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-16 08:00:00",
    end_time: "2026-01-16 10:00:00",
    address: "Hillsborough, CA",
    lat: 37.5575,
    lng: -122.3624,
    max_capacity: 188,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Hollister, CA ---
  {
    id: 375,
    organization_id: 4,
    title: "Hollister Trail Run",
    description:
      "Scenic trail run through open spaces near Hollister. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-17 12:00:00",
    end_time: "2026-05-17 14:00:00",
    address: "Hollister, CA",
    lat: 36.8514,
    lng: -121.4012,
    max_capacity: 140,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Holtville, CA ---
  {
    id: 376,
    organization_id: 1,
    title: "Holtville Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Holtville, CA",
    lat: 32.8161,
    lng: -115.3755,
    max_capacity: 597,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Hughson, CA ---
  {
    id: 377,
    organization_id: 2,
    title: "Hughson Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-16 17:00:00",
    end_time: "2026-10-16 19:00:00",
    address: "Hughson, CA",
    lat: 37.6002,
    lng: -120.8685,
    max_capacity: 153,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Huntington Beach, CA ---
  {
    id: 378,
    organization_id: 3,
    title: "Huntington Beach Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-12-03 19:00:00",
    end_time: "2026-12-03 21:00:00",
    address: "Huntington Beach, CA",
    lat: 33.6608,
    lng: -117.9987,
    max_capacity: 255,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 379,
    organization_id: 4,
    title: "Huntington Beach Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-10 09:00:00",
    end_time: "2026-03-10 12:00:00",
    address: "Huntington Beach, CA",
    lat: 33.6608,
    lng: -117.9987,
    max_capacity: 36,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 380,
    organization_id: 1,
    title: "Huntington Beach Multicultural Festival",
    description:
      "A celebration of Huntington Beach's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-17 11:00:00",
    end_time: "2026-06-17 15:00:00",
    address: "Huntington Beach, CA",
    lat: 33.6608,
    lng: -117.9987,
    max_capacity: 1557,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Huntington Park, CA ---
  {
    id: 381,
    organization_id: 2,
    title: "Huntington Park Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-19 14:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "Huntington Park, CA",
    lat: 33.9822,
    lng: -118.224,
    max_capacity: 58,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 382,
    organization_id: 3,
    title: "Huntington Park Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-26 16:00:00",
    end_time: "2026-10-26 19:00:00",
    address: "Huntington Park, CA",
    lat: 33.9822,
    lng: -118.224,
    max_capacity: 19,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Huron, CA ---
  {
    id: 383,
    organization_id: 4,
    title: "Huron Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Fresno County artists.",
    start_time: "2026-07-19 14:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "Huron, CA",
    lat: 36.2059,
    lng: -120.0975,
    max_capacity: 482,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Imperial, CA ---
  {
    id: 384,
    organization_id: 1,
    title: "Imperial Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Imperial, CA",
    lat: 32.8524,
    lng: -115.5648,
    max_capacity: 126,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Imperial Beach, CA ---
  {
    id: 385,
    organization_id: 2,
    title: "Imperial Beach Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-06 19:00:00",
    end_time: "2026-12-06 21:00:00",
    address: "Imperial Beach, CA",
    lat: 32.5868,
    lng: -117.1102,
    max_capacity: 279,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Indian Wells, CA ---
  {
    id: 386,
    organization_id: 3,
    title: "Indian Wells Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-10-22 17:00:00",
    end_time: "2026-10-22 19:00:00",
    address: "Indian Wells, CA",
    lat: 33.72,
    lng: -116.3398,
    max_capacity: 69,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Indio, CA ---
  {
    id: 387,
    organization_id: 4,
    title: "Indio Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-09-15 16:00:00",
    end_time: "2026-09-15 18:00:00",
    address: "Indio, CA",
    lat: 33.7208,
    lng: -116.2154,
    max_capacity: 352,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 388,
    organization_id: 1,
    title: "Indio Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-22 18:00:00",
    end_time: "2026-12-22 21:00:00",
    address: "Indio, CA",
    lat: 33.7208,
    lng: -116.2154,
    max_capacity: 253,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Industry, CA ---
  {
    id: 389,
    organization_id: 2,
    title: "Industry Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Industry, CA",
    lat: 34.0151,
    lng: -117.9631,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Inglewood, CA ---
  {
    id: 390,
    organization_id: 3,
    title: "Inglewood Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-05 18:00:00",
    end_time: "2026-11-05 20:00:00",
    address: "Inglewood, CA",
    lat: 33.9601,
    lng: -118.3547,
    max_capacity: 134,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 391,
    organization_id: 4,
    title: "Inglewood Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-12 08:00:00",
    end_time: "2026-02-12 11:00:00",
    address: "Inglewood, CA",
    lat: 33.9601,
    lng: -118.3547,
    max_capacity: 65,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 392,
    organization_id: 1,
    title: "Inglewood Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-19 10:00:00",
    end_time: "2026-05-19 14:00:00",
    address: "Inglewood, CA",
    lat: 33.9601,
    lng: -118.3547,
    max_capacity: 116,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Ione, CA ---
  {
    id: 393,
    organization_id: 2,
    title: "Ione Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Ione, CA",
    lat: 38.3551,
    lng: -120.9306,
    max_capacity: 171,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Irvine, CA ---
  {
    id: 394,
    organization_id: 3,
    title: "Irvine Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-10 08:00:00",
    end_time: "2026-01-10 10:00:00",
    address: "Irvine, CA",
    lat: 33.6868,
    lng: -117.8243,
    max_capacity: 122,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 395,
    organization_id: 4,
    title: "Irvine Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-04-17 10:00:00",
    end_time: "2026-04-17 13:00:00",
    address: "Irvine, CA",
    lat: 33.6868,
    lng: -117.8243,
    max_capacity: 673,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 396,
    organization_id: 1,
    title: "Irvine Half Marathon",
    description:
      "A scenic half marathon through the heart of Irvine. Certified course, chip timing, and finisher medals.",
    start_time: "2026-07-24 12:00:00",
    end_time: "2026-07-24 16:00:00",
    address: "Irvine, CA",
    lat: 33.6868,
    lng: -117.8243,
    max_capacity: 1774,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 397,
    organization_id: 2,
    title: "Irvine Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-10-04 14:00:00",
    end_time: "2026-10-04 16:00:00",
    address: "Irvine, CA",
    lat: 33.6868,
    lng: -117.8243,
    max_capacity: 1075,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Irwindale, CA ---
  {
    id: 398,
    organization_id: 3,
    title: "Irwindale Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-09-09 16:00:00",
    end_time: "2026-09-09 18:00:00",
    address: "Irwindale, CA",
    lat: 34.1053,
    lng: -117.9298,
    max_capacity: 226,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Isleton, CA ---
  {
    id: 399,
    organization_id: 4,
    title: "Isleton Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-26 09:00:00",
    end_time: "2026-02-26 11:00:00",
    address: "Isleton, CA",
    lat: 38.1558,
    lng: -121.6137,
    max_capacity: 337,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Jackson, CA ---
  {
    id: 400,
    organization_id: 1,
    title: "Jackson Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-02-20 09:00:00",
    end_time: "2026-02-20 11:00:00",
    address: "Jackson, CA",
    lat: 38.3509,
    lng: -120.7706,
    max_capacity: 1085,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Jurupa Valley, CA ---
  {
    id: 401,
    organization_id: 2,
    title: "Jurupa Valley Multicultural Festival",
    description:
      "A celebration of Jurupa Valley's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Jurupa Valley, CA",
    lat: 33.9934,
    lng: -117.4891,
    max_capacity: 2609,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 402,
    organization_id: 3,
    title: "Jurupa Valley Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-21 11:00:00",
    end_time: "2026-05-21 14:00:00",
    address: "Jurupa Valley, CA",
    lat: 33.9934,
    lng: -117.4891,
    max_capacity: 110,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 403,
    organization_id: 4,
    title: "Jurupa Valley 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-01 13:00:00",
    end_time: "2026-08-01 17:00:00",
    address: "Jurupa Valley, CA",
    lat: 33.9934,
    lng: -117.4891,
    max_capacity: 311,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Kerman, CA ---
  {
    id: 404,
    organization_id: 1,
    title: "Kerman Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Kerman. All paces welcome.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Kerman, CA",
    lat: 36.7258,
    lng: -120.0587,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- King City, CA ---
  {
    id: 405,
    organization_id: 2,
    title: "King City Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-02 15:00:00",
    end_time: "2026-08-02 17:00:00",
    address: "King City, CA",
    lat: 36.2148,
    lng: -121.124,
    max_capacity: 171,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Kingsburg, CA ---
  {
    id: 406,
    organization_id: 3,
    title: "Kingsburg Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Kingsburg, CA",
    lat: 36.5163,
    lng: -119.5507,
    max_capacity: 78,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- La Canada Flintridge, CA ---
  {
    id: 407,
    organization_id: 4,
    title: "La Canada Flintridge Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-24 16:00:00",
    end_time: "2026-09-24 18:00:00",
    address: "La Canada Flintridge, CA",
    lat: 34.1959,
    lng: -118.2041,
    max_capacity: 112,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- La Habra, CA ---
  {
    id: 408,
    organization_id: 1,
    title: "La Habra Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-02 12:00:00",
    end_time: "2026-05-02 14:00:00",
    address: "La Habra, CA",
    lat: 33.9313,
    lng: -117.9468,
    max_capacity: 444,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 409,
    organization_id: 2,
    title: "La Habra Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-09 14:00:00",
    end_time: "2026-08-09 17:00:00",
    address: "La Habra, CA",
    lat: 33.9313,
    lng: -117.9468,
    max_capacity: 65,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- La Habra Heights, CA ---
  {
    id: 410,
    organization_id: 3,
    title: "La Habra Heights Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-02-05 09:00:00",
    end_time: "2026-02-05 11:00:00",
    address: "La Habra Heights, CA",
    lat: 33.9617,
    lng: -117.95,
    max_capacity: 553,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- La Mesa, CA ---
  {
    id: 411,
    organization_id: 4,
    title: "La Mesa Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-06 19:00:00",
    end_time: "2026-12-06 21:00:00",
    address: "La Mesa, CA",
    lat: 32.7699,
    lng: -117.021,
    max_capacity: 171,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 412,
    organization_id: 1,
    title: "La Mesa Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at La Mesa's favorite dog park. Treats provided.",
    start_time: "2026-03-13 09:00:00",
    end_time: "2026-03-13 12:00:00",
    address: "La Mesa, CA",
    lat: 32.7699,
    lng: -117.021,
    max_capacity: 122,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- La Mirada, CA ---
  {
    id: 413,
    organization_id: 2,
    title: "La Mirada Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "La Mirada, CA",
    lat: 33.9152,
    lng: -118.0143,
    max_capacity: 430,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- La Palma, CA ---
  {
    id: 414,
    organization_id: 3,
    title: "La Palma Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "La Palma, CA",
    lat: 33.8445,
    lng: -118.0486,
    max_capacity: 131,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- La Puente, CA ---
  {
    id: 415,
    organization_id: 4,
    title: "La Puente Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "La Puente, CA",
    lat: 34.0147,
    lng: -117.9545,
    max_capacity: 503,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- La Quinta, CA ---
  {
    id: 416,
    organization_id: 1,
    title: "La Quinta Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Riverside County. Tasting tickets available at the gate.",
    start_time: "2026-06-09 13:00:00",
    end_time: "2026-06-09 15:00:00",
    address: "La Quinta, CA",
    lat: 33.6584,
    lng: -116.3149,
    max_capacity: 1501,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- La Verne, CA ---
  {
    id: 417,
    organization_id: 2,
    title: "La Verne Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "La Verne, CA",
    lat: 34.0963,
    lng: -117.7723,
    max_capacity: 25,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Lafayette, CA ---
  {
    id: 418,
    organization_id: 3,
    title: "Lafayette Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-03 19:00:00",
    end_time: "2026-12-03 21:00:00",
    address: "Lafayette, CA",
    lat: 37.8855,
    lng: -122.1183,
    max_capacity: 2247,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Laguna Beach, CA ---
  {
    id: 419,
    organization_id: 4,
    title: "Laguna Beach Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-25 08:00:00",
    end_time: "2026-01-25 10:00:00",
    address: "Laguna Beach, CA",
    lat: 33.542,
    lng: -117.7833,
    max_capacity: 188,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Laguna Hills, CA ---
  {
    id: 420,
    organization_id: 1,
    title: "Laguna Hills Half Marathon",
    description:
      "A scenic half marathon through the heart of Laguna Hills. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Laguna Hills, CA",
    lat: 33.6033,
    lng: -117.7036,
    max_capacity: 586,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Laguna Niguel, CA ---
  {
    id: 421,
    organization_id: 2,
    title: "Laguna Niguel Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-02-20 09:00:00",
    end_time: "2026-02-20 11:00:00",
    address: "Laguna Niguel, CA",
    lat: 33.5268,
    lng: -117.7032,
    max_capacity: 193,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 422,
    organization_id: 3,
    title: "Laguna Niguel Trail Run",
    description:
      "Scenic trail run through open spaces near Laguna Niguel. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-27 11:00:00",
    end_time: "2026-05-27 14:00:00",
    address: "Laguna Niguel, CA",
    lat: 33.5268,
    lng: -117.7032,
    max_capacity: 294,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Laguna Woods, CA ---
  {
    id: 423,
    organization_id: 4,
    title: "Laguna Woods Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Laguna Woods, CA",
    lat: 33.6087,
    lng: -117.7254,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Lake Elsinore, CA ---
  {
    id: 424,
    organization_id: 1,
    title: "Lake Elsinore Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Lake Elsinore, CA",
    lat: 33.6651,
    lng: -117.3305,
    max_capacity: 68,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 425,
    organization_id: 2,
    title: "Lake Elsinore Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Lake Elsinore, CA",
    lat: 33.6651,
    lng: -117.3305,
    max_capacity: 29,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Lake Forest, CA ---
  {
    id: 426,
    organization_id: 3,
    title: "Lake Forest Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Lake Forest, CA",
    lat: 33.6517,
    lng: -117.6844,
    max_capacity: 98,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 427,
    organization_id: 4,
    title: "Lake Forest Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-06 08:00:00",
    end_time: "2026-02-06 11:00:00",
    address: "Lake Forest, CA",
    lat: 33.6517,
    lng: -117.6844,
    max_capacity: 29,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Lakeport, CA ---
  {
    id: 428,
    organization_id: 1,
    title: "Lakeport Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "Lakeport, CA",
    lat: 39.0388,
    lng: -122.9205,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Lakewood, CA ---
  {
    id: 429,
    organization_id: 2,
    title: "Lakewood Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-03 19:00:00",
    end_time: "2026-12-03 21:00:00",
    address: "Lakewood, CA",
    lat: 33.8581,
    lng: -118.1294,
    max_capacity: 75,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 430,
    organization_id: 3,
    title: "Lakewood Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Los Angeles County artists.",
    start_time: "2026-03-10 09:00:00",
    end_time: "2026-03-10 12:00:00",
    address: "Lakewood, CA",
    lat: 33.8581,
    lng: -118.1294,
    max_capacity: 296,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Lancaster, CA ---
  {
    id: 431,
    organization_id: 4,
    title: "Lancaster Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Lancaster, CA",
    lat: 34.6917,
    lng: -118.1493,
    max_capacity: 799,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 432,
    organization_id: 1,
    title: "Lancaster Half Marathon",
    description:
      "A scenic half marathon through the heart of Lancaster. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-18 17:00:00",
    end_time: "2026-11-18 20:00:00",
    address: "Lancaster, CA",
    lat: 34.6917,
    lng: -118.1493,
    max_capacity: 700,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 433,
    organization_id: 2,
    title: "Lancaster Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-02-25 19:00:00",
    end_time: "2026-02-25 23:00:00",
    address: "Lancaster, CA",
    lat: 34.6917,
    lng: -118.1493,
    max_capacity: 1401,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Larkspur, CA ---
  {
    id: 434,
    organization_id: 3,
    title: "Larkspur Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Larkspur, CA",
    lat: 37.9333,
    lng: -122.536,
    max_capacity: 134,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Lathrop, CA ---
  {
    id: 435,
    organization_id: 4,
    title: "Lathrop Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Lathrop, CA",
    lat: 37.8254,
    lng: -121.2734,
    max_capacity: 277,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Lawndale, CA ---
  {
    id: 436,
    organization_id: 1,
    title: "Lawndale Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-13 14:00:00",
    end_time: "2026-07-13 16:00:00",
    address: "Lawndale, CA",
    lat: 33.886,
    lng: -118.3538,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Lemon Grove, CA ---
  {
    id: 437,
    organization_id: 2,
    title: "Lemon Grove Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-07-10 14:00:00",
    end_time: "2026-07-10 16:00:00",
    address: "Lemon Grove, CA",
    lat: 32.7389,
    lng: -117.035,
    max_capacity: 214,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Lemoore, CA ---
  {
    id: 438,
    organization_id: 3,
    title: "Lemoore Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-03-03 10:00:00",
    end_time: "2026-03-03 12:00:00",
    address: "Lemoore, CA",
    lat: 36.2986,
    lng: -119.7853,
    max_capacity: 626,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Lincoln, CA ---
  {
    id: 439,
    organization_id: 4,
    title: "Lincoln Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-02-20 09:00:00",
    end_time: "2026-02-20 11:00:00",
    address: "Lincoln, CA",
    lat: 38.8899,
    lng: -121.2952,
    max_capacity: 233,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Lindsay, CA ---
  {
    id: 440,
    organization_id: 1,
    title: "Lindsay Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-08-17 15:00:00",
    end_time: "2026-08-17 17:00:00",
    address: "Lindsay, CA",
    lat: 36.2047,
    lng: -119.0873,
    max_capacity: 359,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Live Oak, CA ---
  {
    id: 441,
    organization_id: 2,
    title: "Live Oak Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-02-23 09:00:00",
    end_time: "2026-02-23 11:00:00",
    address: "Live Oak, CA",
    lat: 39.2741,
    lng: -121.6582,
    max_capacity: 753,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Livermore, CA ---
  {
    id: 442,
    organization_id: 3,
    title: "Livermore Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-09 19:00:00",
    end_time: "2026-12-09 21:00:00",
    address: "Livermore, CA",
    lat: 37.6836,
    lng: -121.7664,
    max_capacity: 767,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 443,
    organization_id: 4,
    title: "Livermore Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-16 09:00:00",
    end_time: "2026-03-16 12:00:00",
    address: "Livermore, CA",
    lat: 37.6836,
    lng: -121.7664,
    max_capacity: 118,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Livingston, CA ---
  {
    id: 444,
    organization_id: 1,
    title: "Livingston Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-27 13:00:00",
    end_time: "2026-06-27 15:00:00",
    address: "Livingston, CA",
    lat: 37.3924,
    lng: -120.7191,
    max_capacity: 597,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Lodi, CA ---
  {
    id: 445,
    organization_id: 2,
    title: "Lodi Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Lodi. All paces welcome.",
    start_time: "2026-03-27 10:00:00",
    end_time: "2026-03-27 12:00:00",
    address: "Lodi, CA",
    lat: 38.1322,
    lng: -121.2704,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 446,
    organization_id: 3,
    title: "Lodi Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-07 12:00:00",
    end_time: "2026-06-07 15:00:00",
    address: "Lodi, CA",
    lat: 38.1322,
    lng: -121.2704,
    max_capacity: 371,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Loma Linda, CA ---
  {
    id: 447,
    organization_id: 4,
    title: "Loma Linda Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-08 18:00:00",
    end_time: "2026-11-08 20:00:00",
    address: "Loma Linda, CA",
    lat: 34.0507,
    lng: -117.259,
    max_capacity: 224,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Lomita, CA ---
  {
    id: 448,
    organization_id: 1,
    title: "Lomita Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-23 18:00:00",
    end_time: "2026-11-23 20:00:00",
    address: "Lomita, CA",
    lat: 33.7906,
    lng: -118.3169,
    max_capacity: 134,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Lompoc, CA ---
  {
    id: 449,
    organization_id: 2,
    title: "Lompoc Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-24 10:00:00",
    end_time: "2026-03-24 12:00:00",
    address: "Lompoc, CA",
    lat: 34.6363,
    lng: -120.4607,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Long Beach, CA ---
  {
    id: 450,
    organization_id: 3,
    title: "Long Beach Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Los Angeles County artists.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Long Beach, CA",
    lat: 33.7673,
    lng: -118.1965,
    max_capacity: 222,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 451,
    organization_id: 4,
    title: "Long Beach Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Long Beach, CA",
    lat: 33.7673,
    lng: -118.1965,
    max_capacity: 83,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 452,
    organization_id: 1,
    title: "Long Beach Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-07 10:00:00",
    end_time: "2026-05-07 14:00:00",
    address: "Long Beach, CA",
    lat: 33.7673,
    lng: -118.1965,
    max_capacity: 214,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 453,
    organization_id: 2,
    title: "Long Beach Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-14 12:00:00",
    end_time: "2026-08-14 14:00:00",
    address: "Long Beach, CA",
    lat: 33.7673,
    lng: -118.1965,
    max_capacity: 325,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Loomis, CA ---
  {
    id: 454,
    organization_id: 3,
    title: "Loomis Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Loomis, CA",
    lat: 38.8227,
    lng: -121.1924,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Los Alamitos, CA ---
  {
    id: 455,
    organization_id: 4,
    title: "Los Alamitos Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-27 16:00:00",
    end_time: "2026-09-27 18:00:00",
    address: "Los Alamitos, CA",
    lat: 33.8062,
    lng: -118.0689,
    max_capacity: 484,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Los Altos, CA ---
  {
    id: 456,
    organization_id: 1,
    title: "Los Altos Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-25 11:00:00",
    end_time: "2026-04-25 13:00:00",
    address: "Los Altos, CA",
    lat: 37.3813,
    lng: -122.118,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Los Altos Hills, CA ---
  {
    id: 457,
    organization_id: 2,
    title: "Los Altos Hills Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-05 18:00:00",
    end_time: "2026-11-05 20:00:00",
    address: "Los Altos Hills, CA",
    lat: 37.3803,
    lng: -122.1434,
    max_capacity: 104,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Los Banos, CA ---
  {
    id: 458,
    organization_id: 3,
    title: "Los Banos Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-15 19:00:00",
    end_time: "2026-12-15 21:00:00",
    address: "Los Banos, CA",
    lat: 37.0626,
    lng: -120.845,
    max_capacity: 399,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Los Gatos, CA ---
  {
    id: 459,
    organization_id: 4,
    title: "Los Gatos Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Los Gatos. All paces welcome.",
    start_time: "2026-11-02 18:00:00",
    end_time: "2026-11-02 20:00:00",
    address: "Los Gatos, CA",
    lat: 37.2338,
    lng: -121.9644,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Loyalton, CA ---
  {
    id: 460,
    organization_id: 1,
    title: "Loyalton Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-12 10:00:00",
    end_time: "2026-03-12 12:00:00",
    address: "Loyalton, CA",
    lat: 39.6783,
    lng: -120.2362,
    max_capacity: 270,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Lynwood, CA ---
  {
    id: 461,
    organization_id: 2,
    title: "Lynwood Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "Lynwood, CA",
    lat: 33.9332,
    lng: -118.2085,
    max_capacity: 379,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 462,
    organization_id: 3,
    title: "Lynwood Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-26 13:00:00",
    end_time: "2026-07-26 16:00:00",
    address: "Lynwood, CA",
    lat: 33.9332,
    lng: -118.2085,
    max_capacity: 580,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Madera, CA ---
  {
    id: 463,
    organization_id: 4,
    title: "Madera Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Madera. All skill levels welcome.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "Madera, CA",
    lat: 36.965,
    lng: -120.057,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 464,
    organization_id: 1,
    title: "Madera Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-19 09:00:00",
    end_time: "2026-03-19 12:00:00",
    address: "Madera, CA",
    lat: 36.965,
    lng: -120.057,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Malibu, CA ---
  {
    id: 465,
    organization_id: 2,
    title: "Malibu Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Malibu, CA",
    lat: 34.0214,
    lng: -118.7843,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Mammoth Lakes, CA ---
  {
    id: 466,
    organization_id: 3,
    title: "Mammoth Lakes Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-13 14:00:00",
    end_time: "2026-07-13 16:00:00",
    address: "Mammoth Lakes, CA",
    lat: 37.6473,
    lng: -118.9733,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Manhattan Beach, CA ---
  {
    id: 467,
    organization_id: 4,
    title: "Manhattan Beach Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-01-22 08:00:00",
    end_time: "2026-01-22 10:00:00",
    address: "Manhattan Beach, CA",
    lat: 33.8801,
    lng: -118.4155,
    max_capacity: 804,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Manteca, CA ---
  {
    id: 468,
    organization_id: 1,
    title: "Manteca Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-23 15:00:00",
    end_time: "2026-08-23 17:00:00",
    address: "Manteca, CA",
    lat: 37.7938,
    lng: -121.2199,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 469,
    organization_id: 2,
    title: "Manteca Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Manteca's favorite dog park. Treats provided.",
    start_time: "2026-11-03 17:00:00",
    end_time: "2026-11-03 20:00:00",
    address: "Manteca, CA",
    lat: 37.7938,
    lng: -121.2199,
    max_capacity: 62,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Maricopa, CA ---
  {
    id: 470,
    organization_id: 3,
    title: "Maricopa Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Maricopa, CA",
    lat: 35.0559,
    lng: -119.4031,
    max_capacity: 826,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Marina, CA ---
  {
    id: 471,
    organization_id: 4,
    title: "Marina Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Marina, CA",
    lat: 36.6826,
    lng: -121.8028,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Martinez, CA ---
  {
    id: 472,
    organization_id: 1,
    title: "Martinez Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "Martinez, CA",
    lat: 38.0148,
    lng: -122.1387,
    max_capacity: 604,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Marysville, CA ---
  {
    id: 473,
    organization_id: 2,
    title: "Marysville Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-20 15:00:00",
    end_time: "2026-08-20 17:00:00",
    address: "Marysville, CA",
    lat: 39.1418,
    lng: -121.5952,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Maywood, CA ---
  {
    id: 474,
    organization_id: 3,
    title: "Maywood Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-18 10:00:00",
    end_time: "2026-03-18 12:00:00",
    address: "Maywood, CA",
    lat: 33.9819,
    lng: -118.1904,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- McFarland, CA ---
  {
    id: 475,
    organization_id: 4,
    title: "McFarland Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "McFarland, CA",
    lat: 35.6774,
    lng: -119.2321,
    max_capacity: 71,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Mendota, CA ---
  {
    id: 476,
    organization_id: 1,
    title: "Mendota Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-15 19:00:00",
    end_time: "2026-12-15 21:00:00",
    address: "Mendota, CA",
    lat: 36.7553,
    lng: -120.3779,
    max_capacity: 279,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Menifee, CA ---
  {
    id: 477,
    organization_id: 2,
    title: "Menifee Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-19 17:00:00",
    end_time: "2026-10-19 19:00:00",
    address: "Menifee, CA",
    lat: 33.6934,
    lng: -117.1887,
    max_capacity: 113,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 478,
    organization_id: 3,
    title: "Menifee Trail Run",
    description:
      "Scenic trail run through open spaces near Menifee. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-26 19:00:00",
    end_time: "2026-01-26 22:00:00",
    address: "Menifee, CA",
    lat: 33.6934,
    lng: -117.1887,
    max_capacity: 314,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 479,
    organization_id: 4,
    title: "Menifee Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-04-06 09:00:00",
    end_time: "2026-04-06 13:00:00",
    address: "Menifee, CA",
    lat: 33.6934,
    lng: -117.1887,
    max_capacity: 1015,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Menlo Park, CA ---
  {
    id: 480,
    organization_id: 1,
    title: "Menlo Park Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Menlo Park, CA",
    lat: 37.4494,
    lng: -122.1853,
    max_capacity: 114,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Merced, CA ---
  {
    id: 481,
    organization_id: 2,
    title: "Merced Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Merced, CA",
    lat: 37.3052,
    lng: -120.48,
    max_capacity: 980,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 482,
    organization_id: 3,
    title: "Merced Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Merced. All skill levels welcome.",
    start_time: "2026-12-01 18:00:00",
    end_time: "2026-12-01 21:00:00",
    address: "Merced, CA",
    lat: 37.3052,
    lng: -120.48,
    max_capacity: 21,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Mill Valley, CA ---
  {
    id: 483,
    organization_id: 4,
    title: "Mill Valley Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Mill Valley, CA",
    lat: 37.9108,
    lng: -122.5402,
    max_capacity: 98,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Millbrae, CA ---
  {
    id: 484,
    organization_id: 1,
    title: "Millbrae Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Millbrae, CA",
    lat: 37.5958,
    lng: -122.3908,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Milpitas, CA ---
  {
    id: 485,
    organization_id: 2,
    title: "Milpitas Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-09-27 16:00:00",
    end_time: "2026-09-27 18:00:00",
    address: "Milpitas, CA",
    lat: 37.4345,
    lng: -121.8974,
    max_capacity: 472,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 486,
    organization_id: 3,
    title: "Milpitas Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-07 18:00:00",
    end_time: "2026-12-07 21:00:00",
    address: "Milpitas, CA",
    lat: 37.4345,
    lng: -121.8974,
    max_capacity: 373,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Mission Viejo, CA ---
  {
    id: 487,
    organization_id: 4,
    title: "Mission Viejo Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-05 12:00:00",
    end_time: "2026-05-05 14:00:00",
    address: "Mission Viejo, CA",
    lat: 33.5994,
    lng: -117.6726,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 488,
    organization_id: 1,
    title: "Mission Viejo Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-12 14:00:00",
    end_time: "2026-08-12 17:00:00",
    address: "Mission Viejo, CA",
    lat: 33.5994,
    lng: -117.6726,
    max_capacity: 245,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Modesto, CA ---
  {
    id: 489,
    organization_id: 2,
    title: "Modesto Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "Modesto, CA",
    lat: 37.6394,
    lng: -120.9966,
    max_capacity: 653,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 490,
    organization_id: 3,
    title: "Modesto Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-01 15:00:00",
    end_time: "2026-09-01 18:00:00",
    address: "Modesto, CA",
    lat: 37.6394,
    lng: -120.9966,
    max_capacity: 554,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 491,
    organization_id: 4,
    title: "Modesto Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Modesto. All skill levels welcome.",
    start_time: "2026-12-08 17:00:00",
    end_time: "2026-12-08 21:00:00",
    address: "Modesto, CA",
    lat: 37.6394,
    lng: -120.9966,
    max_capacity: 35,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 492,
    organization_id: 1,
    title: "Modesto Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-15 19:00:00",
    end_time: "2026-03-15 21:00:00",
    address: "Modesto, CA",
    lat: 37.6394,
    lng: -120.9966,
    max_capacity: 116,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Monrovia, CA ---
  {
    id: 493,
    organization_id: 2,
    title: "Monrovia Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "Monrovia, CA",
    lat: 34.1457,
    lng: -117.9983,
    max_capacity: 15,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Montague, CA ---
  {
    id: 494,
    organization_id: 3,
    title: "Montague Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-15 16:00:00",
    end_time: "2026-09-15 18:00:00",
    address: "Montague, CA",
    lat: 41.7263,
    lng: -122.5254,
    max_capacity: 1364,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Montclair, CA ---
  {
    id: 495,
    organization_id: 4,
    title: "Montclair Trail Run",
    description:
      "Scenic trail run through open spaces near Montclair. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-12 16:00:00",
    end_time: "2026-09-12 18:00:00",
    address: "Montclair, CA",
    lat: 34.0785,
    lng: -117.6888,
    max_capacity: 360,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Monte Sereno, CA ---
  {
    id: 496,
    organization_id: 1,
    title: "Monte Sereno Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "Monte Sereno, CA",
    lat: 37.2288,
    lng: -121.9893,
    max_capacity: 533,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Montebello, CA ---
  {
    id: 497,
    organization_id: 2,
    title: "Montebello Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-17 12:00:00",
    end_time: "2026-05-17 14:00:00",
    address: "Montebello, CA",
    lat: 34.0098,
    lng: -118.1133,
    max_capacity: 168,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 498,
    organization_id: 3,
    title: "Montebello Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-08-24 14:00:00",
    end_time: "2026-08-24 17:00:00",
    address: "Montebello, CA",
    lat: 34.0098,
    lng: -118.1133,
    max_capacity: 449,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Monterey, CA ---
  {
    id: 499,
    organization_id: 4,
    title: "Monterey Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Monterey County. Tasting tickets available at the gate.",
    start_time: "2026-10-01 17:00:00",
    end_time: "2026-10-01 19:00:00",
    address: "Monterey, CA",
    lat: 36.6033,
    lng: -121.8916,
    max_capacity: 581,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Monterey Park, CA ---
  {
    id: 500,
    organization_id: 1,
    title: "Monterey Park Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-19 14:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "Monterey Park, CA",
    lat: 34.0585,
    lng: -118.1268,
    max_capacity: 510,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 501,
    organization_id: 2,
    title: "Monterey Park Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-26 16:00:00",
    end_time: "2026-10-26 19:00:00",
    address: "Monterey Park, CA",
    lat: 34.0585,
    lng: -118.1268,
    max_capacity: 511,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Moorpark, CA ---
  {
    id: 502,
    organization_id: 3,
    title: "Moorpark Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-19 17:00:00",
    end_time: "2026-10-19 19:00:00",
    address: "Moorpark, CA",
    lat: 34.2845,
    lng: -118.8827,
    max_capacity: 237,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Moraga, CA ---
  {
    id: 503,
    organization_id: 4,
    title: "Moraga Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-26 09:00:00",
    end_time: "2026-02-26 11:00:00",
    address: "Moraga, CA",
    lat: 37.8368,
    lng: -122.1283,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Moreno Valley, CA ---
  {
    id: 504,
    organization_id: 1,
    title: "Moreno Valley 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Moreno Valley, CA",
    lat: 33.9438,
    lng: -117.2284,
    max_capacity: 563,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 505,
    organization_id: 2,
    title: "Moreno Valley Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Moreno Valley. All paces welcome.",
    start_time: "2026-07-08 13:00:00",
    end_time: "2026-07-08 16:00:00",
    address: "Moreno Valley, CA",
    lat: 33.9438,
    lng: -117.2284,
    max_capacity: 44,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 506,
    organization_id: 3,
    title: "Moreno Valley Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-10-15 15:00:00",
    end_time: "2026-10-15 19:00:00",
    address: "Moreno Valley, CA",
    lat: 33.9438,
    lng: -117.2284,
    max_capacity: 565,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 507,
    organization_id: 4,
    title: "Moreno Valley Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-01-22 17:00:00",
    end_time: "2026-01-22 19:00:00",
    address: "Moreno Valley, CA",
    lat: 33.9438,
    lng: -117.2284,
    max_capacity: 26,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Morgan Hill, CA ---
  {
    id: 508,
    organization_id: 1,
    title: "Morgan Hill Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-21 19:00:00",
    end_time: "2026-12-21 21:00:00",
    address: "Morgan Hill, CA",
    lat: 37.1346,
    lng: -121.6503,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Morro Bay, CA ---
  {
    id: 509,
    organization_id: 2,
    title: "Morro Bay Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-03 13:00:00",
    end_time: "2026-06-03 15:00:00",
    address: "Morro Bay, CA",
    lat: 35.3609,
    lng: -120.8548,
    max_capacity: 71,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Mount Shasta, CA ---
  {
    id: 510,
    organization_id: 3,
    title: "Mount Shasta Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "Mount Shasta, CA",
    lat: 41.3142,
    lng: -122.3104,
    max_capacity: 1493,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Mountain House, CA ---
  {
    id: 511,
    organization_id: 4,
    title: "Mountain House Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-18 16:00:00",
    end_time: "2026-09-18 18:00:00",
    address: "Mountain House, CA",
    lat: 37.7694,
    lng: -121.5419,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Mountain View, CA ---
  {
    id: 512,
    organization_id: 1,
    title: "Mountain View Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-25 14:00:00",
    end_time: "2026-07-25 16:00:00",
    address: "Mountain View, CA",
    lat: 37.3905,
    lng: -122.0795,
    max_capacity: 94,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 513,
    organization_id: 2,
    title: "Mountain View Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Santa Clara County. Tasting tickets available at the gate.",
    start_time: "2026-10-05 16:00:00",
    end_time: "2026-10-05 19:00:00",
    address: "Mountain View, CA",
    lat: 37.3905,
    lng: -122.0795,
    max_capacity: 1695,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Murrieta, CA ---
  {
    id: 514,
    organization_id: 3,
    title: "Murrieta Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Murrieta, CA",
    lat: 33.5579,
    lng: -117.2099,
    max_capacity: 390,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 515,
    organization_id: 4,
    title: "Murrieta Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-16 12:00:00",
    end_time: "2026-06-16 15:00:00",
    address: "Murrieta, CA",
    lat: 33.5579,
    lng: -117.2099,
    max_capacity: 391,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 516,
    organization_id: 1,
    title: "Murrieta Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-23 14:00:00",
    end_time: "2026-09-23 18:00:00",
    address: "Murrieta, CA",
    lat: 33.5579,
    lng: -117.2099,
    max_capacity: 1092,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Napa, CA ---
  {
    id: 517,
    organization_id: 2,
    title: "Napa Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "Napa, CA",
    lat: 38.2952,
    lng: -122.2892,
    max_capacity: 2327,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 518,
    organization_id: 3,
    title: "Napa Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-06 17:00:00",
    end_time: "2026-11-06 20:00:00",
    address: "Napa, CA",
    lat: 38.2952,
    lng: -122.2892,
    max_capacity: 228,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- National City, CA ---
  {
    id: 519,
    organization_id: 4,
    title: "National City Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "National City, CA",
    lat: 32.6758,
    lng: -117.1015,
    max_capacity: 827,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 520,
    organization_id: 1,
    title: "National City Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-07-14 13:00:00",
    end_time: "2026-07-14 16:00:00",
    address: "National City, CA",
    lat: 32.6758,
    lng: -117.1015,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Needles, CA ---
  {
    id: 521,
    organization_id: 2,
    title: "Needles Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Needles's favorite dog park. Treats provided.",
    start_time: "2026-11-02 18:00:00",
    end_time: "2026-11-02 20:00:00",
    address: "Needles, CA",
    lat: 34.8511,
    lng: -114.6116,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Nevada City, CA ---
  {
    id: 522,
    organization_id: 3,
    title: "Nevada City Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-05 18:00:00",
    end_time: "2026-11-05 20:00:00",
    address: "Nevada City, CA",
    lat: 39.2573,
    lng: -121.0117,
    max_capacity: 510,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Newark, CA ---
  {
    id: 523,
    organization_id: 4,
    title: "Newark Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Alameda County. Tasting tickets available at the gate.",
    start_time: "2026-06-27 13:00:00",
    end_time: "2026-06-27 15:00:00",
    address: "Newark, CA",
    lat: 37.5287,
    lng: -122.0411,
    max_capacity: 1441,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Newman, CA ---
  {
    id: 524,
    organization_id: 1,
    title: "Newman Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-17 15:00:00",
    end_time: "2026-08-17 17:00:00",
    address: "Newman, CA",
    lat: 37.3103,
    lng: -121.0248,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Newport Beach, CA ---
  {
    id: 525,
    organization_id: 2,
    title: "Newport Beach Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-26 18:00:00",
    end_time: "2026-11-26 20:00:00",
    address: "Newport Beach, CA",
    lat: 33.6193,
    lng: -117.9285,
    max_capacity: 104,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 526,
    organization_id: 3,
    title: "Newport Beach Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-06 08:00:00",
    end_time: "2026-02-06 11:00:00",
    address: "Newport Beach, CA",
    lat: 33.6193,
    lng: -117.9285,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Norco, CA ---
  {
    id: 527,
    organization_id: 4,
    title: "Norco Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-20 09:00:00",
    end_time: "2026-02-20 11:00:00",
    address: "Norco, CA",
    lat: 33.927,
    lng: -117.553,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Norwalk, CA ---
  {
    id: 528,
    organization_id: 1,
    title: "Norwalk Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Los Angeles County artists.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Norwalk, CA",
    lat: 33.9034,
    lng: -118.0808,
    max_capacity: 462,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 529,
    organization_id: 2,
    title: "Norwalk Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-21 08:00:00",
    end_time: "2026-02-21 11:00:00",
    address: "Norwalk, CA",
    lat: 33.9034,
    lng: -118.0808,
    max_capacity: 83,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 530,
    organization_id: 3,
    title: "Norwalk Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-01 10:00:00",
    end_time: "2026-05-01 14:00:00",
    address: "Norwalk, CA",
    lat: 33.9034,
    lng: -118.0808,
    max_capacity: 204,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Novato, CA ---
  {
    id: 531,
    organization_id: 4,
    title: "Novato Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-12-24 19:00:00",
    end_time: "2026-12-24 21:00:00",
    address: "Novato, CA",
    lat: 38.1123,
    lng: -122.5648,
    max_capacity: 599,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 532,
    organization_id: 1,
    title: "Novato Half Marathon",
    description:
      "A scenic half marathon through the heart of Novato. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-04 09:00:00",
    end_time: "2026-03-04 12:00:00",
    address: "Novato, CA",
    lat: 38.1123,
    lng: -122.5648,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Oakdale, CA ---
  {
    id: 533,
    organization_id: 2,
    title: "Oakdale Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Stanislaus County. Tasting tickets available at the gate.",
    start_time: "2026-10-25 17:00:00",
    end_time: "2026-10-25 19:00:00",
    address: "Oakdale, CA",
    lat: 37.7997,
    lng: -120.844,
    max_capacity: 1481,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Oakland, CA ---
  {
    id: 534,
    organization_id: 3,
    title: "Oakland Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Oakland. All skill levels welcome.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Oakland, CA",
    lat: 37.8061,
    lng: -122.2695,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 535,
    organization_id: 4,
    title: "Oakland Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-14 13:00:00",
    end_time: "2026-07-14 16:00:00",
    address: "Oakland, CA",
    lat: 37.8061,
    lng: -122.2695,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 536,
    organization_id: 1,
    title: "Oakland Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Alameda County. Tasting tickets available at the gate.",
    start_time: "2026-10-21 15:00:00",
    end_time: "2026-10-21 19:00:00",
    address: "Oakland, CA",
    lat: 37.8061,
    lng: -122.2695,
    max_capacity: 1369,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 537,
    organization_id: 2,
    title: "Oakland Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-01 17:00:00",
    end_time: "2026-01-01 19:00:00",
    address: "Oakland, CA",
    lat: 37.8061,
    lng: -122.2695,
    max_capacity: 170,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Oakley, CA ---
  {
    id: 538,
    organization_id: 3,
    title: "Oakley Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-11-05 18:00:00",
    end_time: "2026-11-05 20:00:00",
    address: "Oakley, CA",
    lat: 37.995,
    lng: -121.7151,
    max_capacity: 826,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Oceanside, CA ---
  {
    id: 539,
    organization_id: 4,
    title: "Oceanside Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Oceanside, CA",
    lat: 33.194,
    lng: -117.3814,
    max_capacity: 111,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 540,
    organization_id: 1,
    title: "Oceanside Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-08 13:00:00",
    end_time: "2026-07-08 16:00:00",
    address: "Oceanside, CA",
    lat: 33.194,
    lng: -117.3814,
    max_capacity: 82,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 541,
    organization_id: 2,
    title: "Oceanside Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-15 15:00:00",
    end_time: "2026-10-15 19:00:00",
    address: "Oceanside, CA",
    lat: 33.194,
    lng: -117.3814,
    max_capacity: 23,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Ojai, CA ---
  {
    id: 542,
    organization_id: 3,
    title: "Ojai Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-06 10:00:00",
    end_time: "2026-03-06 12:00:00",
    address: "Ojai, CA",
    lat: 34.452,
    lng: -119.2389,
    max_capacity: 390,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Ontario, CA ---
  {
    id: 543,
    organization_id: 4,
    title: "Ontario Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-04 11:00:00",
    end_time: "2026-04-04 13:00:00",
    address: "Ontario, CA",
    lat: 34.0658,
    lng: -117.6484,
    max_capacity: 55,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 544,
    organization_id: 1,
    title: "Ontario Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by San Bernardino County artists.",
    start_time: "2026-07-11 13:00:00",
    end_time: "2026-07-11 16:00:00",
    address: "Ontario, CA",
    lat: 34.0658,
    lng: -117.6484,
    max_capacity: 276,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 545,
    organization_id: 2,
    title: "Ontario Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-10-18 15:00:00",
    end_time: "2026-10-18 19:00:00",
    address: "Ontario, CA",
    lat: 34.0658,
    lng: -117.6484,
    max_capacity: 77,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Orange, CA ---
  {
    id: 546,
    organization_id: 3,
    title: "Orange Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "Orange, CA",
    lat: 33.7858,
    lng: -117.8552,
    max_capacity: 69,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 547,
    organization_id: 4,
    title: "Orange Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-01-17 19:00:00",
    end_time: "2026-01-17 22:00:00",
    address: "Orange, CA",
    lat: 33.7858,
    lng: -117.8552,
    max_capacity: 180,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 548,
    organization_id: 1,
    title: "Orange Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-04-24 09:00:00",
    end_time: "2026-04-24 13:00:00",
    address: "Orange, CA",
    lat: 33.7858,
    lng: -117.8552,
    max_capacity: 431,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Orange Cove, CA ---
  {
    id: 549,
    organization_id: 2,
    title: "Orange Cove Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Fresno County. Tasting tickets available at the gate.",
    start_time: "2026-10-07 17:00:00",
    end_time: "2026-10-07 19:00:00",
    address: "Orange Cove, CA",
    lat: 36.6232,
    lng: -119.3141,
    max_capacity: 1841,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Orinda, CA ---
  {
    id: 550,
    organization_id: 3,
    title: "Orinda Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-22 14:00:00",
    end_time: "2026-07-22 16:00:00",
    address: "Orinda, CA",
    lat: 37.8747,
    lng: -122.1826,
    max_capacity: 726,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Orland, CA ---
  {
    id: 551,
    organization_id: 4,
    title: "Orland Trail Run",
    description:
      "Scenic trail run through open spaces near Orland. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-06 16:00:00",
    end_time: "2026-09-06 18:00:00",
    address: "Orland, CA",
    lat: 39.7467,
    lng: -122.1976,
    max_capacity: 240,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Oroville, CA ---
  {
    id: 552,
    organization_id: 1,
    title: "Oroville Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "Oroville, CA",
    lat: 39.5112,
    lng: -121.5589,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Oxnard, CA ---
  {
    id: 553,
    organization_id: 2,
    title: "Oxnard Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-06-03 13:00:00",
    end_time: "2026-06-03 15:00:00",
    address: "Oxnard, CA",
    lat: 34.195,
    lng: -119.1796,
    max_capacity: 2425,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 554,
    organization_id: 3,
    title: "Oxnard Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-10 15:00:00",
    end_time: "2026-09-10 18:00:00",
    address: "Oxnard, CA",
    lat: 34.195,
    lng: -119.1796,
    max_capacity: 176,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 555,
    organization_id: 4,
    title: "Oxnard Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-12-17 17:00:00",
    end_time: "2026-12-17 21:00:00",
    address: "Oxnard, CA",
    lat: 34.195,
    lng: -119.1796,
    max_capacity: 427,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 556,
    organization_id: 1,
    title: "Oxnard Half Marathon",
    description:
      "A scenic half marathon through the heart of Oxnard. Certified course, chip timing, and finisher medals.",
    start_time: "2026-03-24 19:00:00",
    end_time: "2026-03-24 21:00:00",
    address: "Oxnard, CA",
    lat: 34.195,
    lng: -119.1796,
    max_capacity: 928,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Pacific Grove, CA ---
  {
    id: 557,
    organization_id: 2,
    title: "Pacific Grove Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Monterey County. Tasting tickets available at the gate.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Pacific Grove, CA",
    lat: 36.6188,
    lng: -121.9152,
    max_capacity: 1861,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Pacifica, CA ---
  {
    id: 558,
    organization_id: 3,
    title: "Pacifica Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-21 13:00:00",
    end_time: "2026-06-21 15:00:00",
    address: "Pacifica, CA",
    lat: 37.6093,
    lng: -122.4914,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Palm Desert, CA ---
  {
    id: 559,
    organization_id: 4,
    title: "Palm Desert Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-20 09:00:00",
    end_time: "2026-02-20 11:00:00",
    address: "Palm Desert, CA",
    lat: 33.7264,
    lng: -116.3658,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 560,
    organization_id: 1,
    title: "Palm Desert Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-27 11:00:00",
    end_time: "2026-05-27 14:00:00",
    address: "Palm Desert, CA",
    lat: 33.7264,
    lng: -116.3658,
    max_capacity: 140,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Palm Springs, CA ---
  {
    id: 561,
    organization_id: 2,
    title: "Palm Springs Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Palm Springs's favorite dog park. Treats provided.",
    start_time: "2026-11-23 18:00:00",
    end_time: "2026-11-23 20:00:00",
    address: "Palm Springs, CA",
    lat: 33.8331,
    lng: -116.5425,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Palmdale, CA ---
  {
    id: 562,
    organization_id: 3,
    title: "Palmdale Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Los Angeles County. Tasting tickets available at the gate.",
    start_time: "2026-06-24 13:00:00",
    end_time: "2026-06-24 15:00:00",
    address: "Palmdale, CA",
    lat: 34.5805,
    lng: -118.1154,
    max_capacity: 661,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 563,
    organization_id: 4,
    title: "Palmdale Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-04 15:00:00",
    end_time: "2026-09-04 18:00:00",
    address: "Palmdale, CA",
    lat: 34.5805,
    lng: -118.1154,
    max_capacity: 182,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 564,
    organization_id: 1,
    title: "Palmdale Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-12-11 17:00:00",
    end_time: "2026-12-11 21:00:00",
    address: "Palmdale, CA",
    lat: 34.5805,
    lng: -118.1154,
    max_capacity: 83,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Palo Alto, CA ---
  {
    id: 565,
    organization_id: 2,
    title: "Palo Alto Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-05 18:00:00",
    end_time: "2026-11-05 20:00:00",
    address: "Palo Alto, CA",
    lat: 37.4371,
    lng: -122.1478,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 566,
    organization_id: 3,
    title: "Palo Alto Multicultural Festival",
    description:
      "A celebration of Palo Alto's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-12 08:00:00",
    end_time: "2026-02-12 11:00:00",
    address: "Palo Alto, CA",
    lat: 37.4371,
    lng: -122.1478,
    max_capacity: 2903,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Palos Verdes Estates, CA ---
  {
    id: 567,
    organization_id: 4,
    title: "Palos Verdes Estates Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Palos Verdes Estates, CA",
    lat: 33.7897,
    lng: -118.3901,
    max_capacity: 880,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Paradise, CA ---
  {
    id: 568,
    organization_id: 1,
    title: "Paradise Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-04 14:00:00",
    end_time: "2026-07-04 16:00:00",
    address: "Paradise, CA",
    lat: 39.7596,
    lng: -121.6219,
    max_capacity: 550,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Paramount, CA ---
  {
    id: 569,
    organization_id: 2,
    title: "Paramount Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-07 08:00:00",
    end_time: "2026-01-07 10:00:00",
    address: "Paramount, CA",
    lat: 33.8852,
    lng: -118.1637,
    max_capacity: 188,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 570,
    organization_id: 3,
    title: "Paramount Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-14 10:00:00",
    end_time: "2026-04-14 13:00:00",
    address: "Paramount, CA",
    lat: 33.8852,
    lng: -118.1637,
    max_capacity: 89,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Parlier, CA ---
  {
    id: 571,
    organization_id: 4,
    title: "Parlier Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Fresno County. Tasting tickets available at the gate.",
    start_time: "2026-06-12 13:00:00",
    end_time: "2026-06-12 15:00:00",
    address: "Parlier, CA",
    lat: 36.6098,
    lng: -119.5314,
    max_capacity: 1321,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Pasadena, CA ---
  {
    id: 572,
    organization_id: 1,
    title: "Pasadena Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-06 10:00:00",
    end_time: "2026-03-06 12:00:00",
    address: "Pasadena, CA",
    lat: 34.1442,
    lng: -118.1481,
    max_capacity: 94,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 573,
    organization_id: 2,
    title: "Pasadena Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Los Angeles County. Tasting tickets available at the gate.",
    start_time: "2026-06-13 12:00:00",
    end_time: "2026-06-13 15:00:00",
    address: "Pasadena, CA",
    lat: 34.1442,
    lng: -118.1481,
    max_capacity: 1415,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 574,
    organization_id: 3,
    title: "Pasadena Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-20 14:00:00",
    end_time: "2026-09-20 18:00:00",
    address: "Pasadena, CA",
    lat: 34.1442,
    lng: -118.1481,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Paso Robles, CA ---
  {
    id: 575,
    organization_id: 4,
    title: "Paso Robles Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-03-21 10:00:00",
    end_time: "2026-03-21 12:00:00",
    address: "Paso Robles, CA",
    lat: 35.6265,
    lng: -120.6914,
    max_capacity: 446,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Patterson, CA ---
  {
    id: 576,
    organization_id: 1,
    title: "Patterson Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Patterson, CA",
    lat: 37.4701,
    lng: -121.1311,
    max_capacity: 230,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Perris, CA ---
  {
    id: 577,
    organization_id: 2,
    title: "Perris 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-04-16 11:00:00",
    end_time: "2026-04-16 13:00:00",
    address: "Perris, CA",
    lat: 33.7838,
    lng: -117.2273,
    max_capacity: 563,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 578,
    organization_id: 3,
    title: "Perris Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Perris. All paces welcome.",
    start_time: "2026-07-23 13:00:00",
    end_time: "2026-07-23 16:00:00",
    address: "Perris, CA",
    lat: 33.7838,
    lng: -117.2273,
    max_capacity: 44,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Petaluma, CA ---
  {
    id: 579,
    organization_id: 4,
    title: "Petaluma Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-20 12:00:00",
    end_time: "2026-05-20 14:00:00",
    address: "Petaluma, CA",
    lat: 38.231,
    lng: -122.6381,
    max_capacity: 106,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 580,
    organization_id: 1,
    title: "Petaluma 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-27 14:00:00",
    end_time: "2026-08-27 17:00:00",
    address: "Petaluma, CA",
    lat: 38.231,
    lng: -122.6381,
    max_capacity: 637,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Pico Rivera, CA ---
  {
    id: 581,
    organization_id: 2,
    title: "Pico Rivera Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-20 12:00:00",
    end_time: "2026-05-20 14:00:00",
    address: "Pico Rivera, CA",
    lat: 33.9805,
    lng: -118.0993,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 582,
    organization_id: 3,
    title: "Pico Rivera Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-27 14:00:00",
    end_time: "2026-08-27 17:00:00",
    address: "Pico Rivera, CA",
    lat: 33.9805,
    lng: -118.0993,
    max_capacity: 125,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Piedmont, CA ---
  {
    id: 583,
    organization_id: 4,
    title: "Piedmont Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Alameda County. Tasting tickets available at the gate.",
    start_time: "2026-06-24 13:00:00",
    end_time: "2026-06-24 15:00:00",
    address: "Piedmont, CA",
    lat: 37.824,
    lng: -122.2339,
    max_capacity: 1741,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Pinole, CA ---
  {
    id: 584,
    organization_id: 1,
    title: "Pinole Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Contra Costa County. Tasting tickets available at the gate.",
    start_time: "2026-10-07 17:00:00",
    end_time: "2026-10-07 19:00:00",
    address: "Pinole, CA",
    lat: 38.0005,
    lng: -122.696,
    max_capacity: 581,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Pismo Beach, CA ---
  {
    id: 585,
    organization_id: 2,
    title: "Pismo Beach Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Pismo Beach, CA",
    lat: 35.1459,
    lng: -120.6384,
    max_capacity: 226,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Pittsburg, CA ---
  {
    id: 586,
    organization_id: 3,
    title: "Pittsburg Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Pittsburg. All paces welcome.",
    start_time: "2026-11-20 18:00:00",
    end_time: "2026-11-20 20:00:00",
    address: "Pittsburg, CA",
    lat: 38.0243,
    lng: -121.8887,
    max_capacity: 40,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 587,
    organization_id: 4,
    title: "Pittsburg Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-27 08:00:00",
    end_time: "2026-02-27 11:00:00",
    address: "Pittsburg, CA",
    lat: 38.0243,
    lng: -121.8887,
    max_capacity: 411,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Placentia, CA ---
  {
    id: 588,
    organization_id: 1,
    title: "Placentia Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-19 14:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "Placentia, CA",
    lat: 33.8754,
    lng: -117.8671,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 589,
    organization_id: 2,
    title: "Placentia Multicultural Festival",
    description:
      "A celebration of Placentia's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-26 16:00:00",
    end_time: "2026-10-26 19:00:00",
    address: "Placentia, CA",
    lat: 33.8754,
    lng: -117.8671,
    max_capacity: 2283,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Placerville, CA ---
  {
    id: 590,
    organization_id: 3,
    title: "Placerville Half Marathon",
    description:
      "A scenic half marathon through the heart of Placerville. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Placerville, CA",
    lat: 38.7292,
    lng: -120.7989,
    max_capacity: 546,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Pleasant Hill, CA ---
  {
    id: 591,
    organization_id: 4,
    title: "Pleasant Hill Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "Pleasant Hill, CA",
    lat: 37.9463,
    lng: -122.0619,
    max_capacity: 639,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Pleasanton, CA ---
  {
    id: 592,
    organization_id: 1,
    title: "Pleasanton Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-01-10 08:00:00",
    end_time: "2026-01-10 10:00:00",
    address: "Pleasanton, CA",
    lat: 37.6642,
    lng: -121.8729,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 593,
    organization_id: 2,
    title: "Pleasanton Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-17 10:00:00",
    end_time: "2026-04-17 13:00:00",
    address: "Pleasanton, CA",
    lat: 37.6642,
    lng: -121.8729,
    max_capacity: 569,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Plymouth, CA ---
  {
    id: 594,
    organization_id: 3,
    title: "Plymouth Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Plymouth. All skill levels welcome.",
    start_time: "2026-12-18 19:00:00",
    end_time: "2026-12-18 21:00:00",
    address: "Plymouth, CA",
    lat: 38.4821,
    lng: -120.8444,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Point Arena, CA ---
  {
    id: 595,
    organization_id: 4,
    title: "Point Arena Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-18 10:00:00",
    end_time: "2026-03-18 12:00:00",
    address: "Point Arena, CA",
    lat: 38.9089,
    lng: -123.6929,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Pomona, CA ---
  {
    id: 596,
    organization_id: 1,
    title: "Pomona Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Pomona. All paces welcome.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Pomona, CA",
    lat: 34.0513,
    lng: -117.756,
    max_capacity: 40,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 597,
    organization_id: 2,
    title: "Pomona Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-21 08:00:00",
    end_time: "2026-02-21 11:00:00",
    address: "Pomona, CA",
    lat: 34.0513,
    lng: -117.756,
    max_capacity: 411,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 598,
    organization_id: 3,
    title: "Pomona Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-01 10:00:00",
    end_time: "2026-05-01 14:00:00",
    address: "Pomona, CA",
    lat: 34.0513,
    lng: -117.756,
    max_capacity: 32,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Port Hueneme, CA ---
  {
    id: 599,
    organization_id: 4,
    title: "Port Hueneme Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Port Hueneme, CA",
    lat: 34.1523,
    lng: -119.1906,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Porterville, CA ---
  {
    id: 600,
    organization_id: 1,
    title: "Porterville Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "Porterville, CA",
    lat: 36.0662,
    lng: -119.0158,
    max_capacity: 660,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 601,
    organization_id: 2,
    title: "Porterville Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Porterville. All skill levels welcome.",
    start_time: "2026-04-11 10:00:00",
    end_time: "2026-04-11 13:00:00",
    address: "Porterville, CA",
    lat: 36.0662,
    lng: -119.0158,
    max_capacity: 21,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Portola, CA ---
  {
    id: 602,
    organization_id: 3,
    title: "Portola Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-25 08:00:00",
    end_time: "2026-01-25 10:00:00",
    address: "Portola, CA",
    lat: 39.808,
    lng: -120.4718,
    max_capacity: 188,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Portola Valley, CA ---
  {
    id: 603,
    organization_id: 4,
    title: "Portola Valley Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Portola Valley's favorite dog park. Treats provided.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Portola Valley, CA",
    lat: 37.3717,
    lng: -122.237,
    max_capacity: 68,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Poway, CA ---
  {
    id: 604,
    organization_id: 1,
    title: "Poway Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Poway, CA",
    lat: 32.9634,
    lng: -117.0353,
    max_capacity: 126,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Rancho Cordova, CA ---
  {
    id: 605,
    organization_id: 2,
    title: "Rancho Cordova Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Rancho Cordova. All skill levels welcome.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Rancho Cordova, CA",
    lat: 38.5888,
    lng: -121.3025,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 606,
    organization_id: 3,
    title: "Rancho Cordova Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-08 13:00:00",
    end_time: "2026-07-08 16:00:00",
    address: "Rancho Cordova, CA",
    lat: 38.5888,
    lng: -121.3025,
    max_capacity: 48,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Rancho Cucamonga, CA ---
  {
    id: 607,
    organization_id: 4,
    title: "Rancho Cucamonga Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in San Bernardino County. Tasting tickets available at the gate.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "Rancho Cucamonga, CA",
    lat: 34.1035,
    lng: -117.596,
    max_capacity: 1721,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 608,
    organization_id: 1,
    title: "Rancho Cucamonga Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-17 19:00:00",
    end_time: "2026-01-17 22:00:00",
    address: "Rancho Cucamonga, CA",
    lat: 34.1035,
    lng: -117.596,
    max_capacity: 102,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 609,
    organization_id: 2,
    title: "Rancho Cucamonga Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-24 09:00:00",
    end_time: "2026-04-24 13:00:00",
    address: "Rancho Cucamonga, CA",
    lat: 34.1035,
    lng: -117.596,
    max_capacity: 63,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Rancho Mirage, CA ---
  {
    id: 610,
    organization_id: 3,
    title: "Rancho Mirage Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "Rancho Mirage, CA",
    lat: 33.7348,
    lng: -116.4174,
    max_capacity: 81,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Rancho Palos Verdes, CA ---
  {
    id: 611,
    organization_id: 4,
    title: "Rancho Palos Verdes Half Marathon",
    description:
      "A scenic half marathon through the heart of Rancho Palos Verdes. Certified course, chip timing, and finisher medals.",
    start_time: "2026-07-01 14:00:00",
    end_time: "2026-07-01 16:00:00",
    address: "Rancho Palos Verdes, CA",
    lat: 33.7401,
    lng: -118.3914,
    max_capacity: 1106,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Rancho Santa Margarita, CA ---
  {
    id: 612,
    organization_id: 1,
    title: "Rancho Santa Margarita Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Rancho Santa Margarita. All skill levels welcome.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Rancho Santa Margarita, CA",
    lat: 33.6365,
    lng: -117.6074,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Red Bluff, CA ---
  {
    id: 613,
    organization_id: 2,
    title: "Red Bluff Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Red Bluff, CA",
    lat: 40.1829,
    lng: -122.2314,
    max_capacity: 194,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Redding, CA ---
  {
    id: 614,
    organization_id: 3,
    title: "Redding Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Shasta County. Tasting tickets available at the gate.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Redding, CA",
    lat: 40.5856,
    lng: -122.3926,
    max_capacity: 1441,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 615,
    organization_id: 4,
    title: "Redding Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-22 15:00:00",
    end_time: "2026-09-22 18:00:00",
    address: "Redding, CA",
    lat: 40.5856,
    lng: -122.3926,
    max_capacity: 182,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Redlands, CA ---
  {
    id: 616,
    organization_id: 1,
    title: "Redlands Trail Run",
    description:
      "Scenic trail run through open spaces near Redlands. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-06 16:00:00",
    end_time: "2026-09-06 18:00:00",
    address: "Redlands, CA",
    lat: 34.0566,
    lng: -117.1815,
    max_capacity: 360,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 617,
    organization_id: 2,
    title: "Redlands Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-13 18:00:00",
    end_time: "2026-12-13 21:00:00",
    address: "Redlands, CA",
    lat: 34.0566,
    lng: -117.1815,
    max_capacity: 2061,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Redondo Beach, CA ---
  {
    id: 618,
    organization_id: 3,
    title: "Redondo Beach Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-23 15:00:00",
    end_time: "2026-08-23 17:00:00",
    address: "Redondo Beach, CA",
    lat: 33.8453,
    lng: -118.3923,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 619,
    organization_id: 4,
    title: "Redondo Beach Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Redondo Beach's favorite dog park. Treats provided.",
    start_time: "2026-11-03 17:00:00",
    end_time: "2026-11-03 20:00:00",
    address: "Redondo Beach, CA",
    lat: 33.8453,
    lng: -118.3923,
    max_capacity: 62,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Redwood City, CA ---
  {
    id: 620,
    organization_id: 1,
    title: "Redwood City Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by San Mateo County artists.",
    start_time: "2026-03-21 10:00:00",
    end_time: "2026-03-21 12:00:00",
    address: "Redwood City, CA",
    lat: 37.4804,
    lng: -122.2412,
    max_capacity: 202,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 621,
    organization_id: 2,
    title: "Redwood City Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-06-01 12:00:00",
    end_time: "2026-06-01 15:00:00",
    address: "Redwood City, CA",
    lat: 37.4804,
    lng: -122.2412,
    max_capacity: 63,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Reedley, CA ---
  {
    id: 622,
    organization_id: 3,
    title: "Reedley Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Reedley, CA",
    lat: 36.5913,
    lng: -119.4552,
    max_capacity: 300,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },

  // --- Rialto, CA ---
  {
    id: 623,
    organization_id: 4,
    title: "Rialto Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-12-21 19:00:00",
    end_time: "2026-12-21 21:00:00",
    address: "Rialto, CA",
    lat: 34.1073,
    lng: -117.3694,
    max_capacity: 159,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 624,
    organization_id: 1,
    title: "Rialto Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-03-01 09:00:00",
    end_time: "2026-03-01 12:00:00",
    address: "Rialto, CA",
    lat: 34.1073,
    lng: -117.3694,
    max_capacity: 960,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 625,
    organization_id: 2,
    title: "Rialto Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-06-08 11:00:00",
    end_time: "2026-06-08 15:00:00",
    address: "Rialto, CA",
    lat: 34.1073,
    lng: -117.3694,
    max_capacity: 261,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Richmond, CA ---
  {
    id: 626,
    organization_id: 3,
    title: "Richmond 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Richmond, CA",
    lat: 37.9371,
    lng: -122.3464,
    max_capacity: 363,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 627,
    organization_id: 4,
    title: "Richmond Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Richmond. All paces welcome.",
    start_time: "2026-11-12 17:00:00",
    end_time: "2026-11-12 20:00:00",
    address: "Richmond, CA",
    lat: 37.9371,
    lng: -122.3464,
    max_capacity: 44,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 628,
    organization_id: 1,
    title: "Richmond Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-19 19:00:00",
    end_time: "2026-02-19 23:00:00",
    address: "Richmond, CA",
    lat: 37.9371,
    lng: -122.3464,
    max_capacity: 565,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Ridgecrest, CA ---
  {
    id: 629,
    organization_id: 2,
    title: "Ridgecrest Trail Run",
    description:
      "Scenic trail run through open spaces near Ridgecrest. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-12 16:00:00",
    end_time: "2026-09-12 18:00:00",
    address: "Ridgecrest, CA",
    lat: 35.6235,
    lng: -117.6699,
    max_capacity: 360,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Rio Dell, CA ---
  {
    id: 630,
    organization_id: 3,
    title: "Rio Dell Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-18 10:00:00",
    end_time: "2026-03-18 12:00:00",
    address: "Rio Dell, CA",
    lat: 40.5015,
    lng: -124.1032,
    max_capacity: 144,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Rio Vista, CA ---
  {
    id: 631,
    organization_id: 4,
    title: "Rio Vista Trail Run",
    description:
      "Scenic trail run through open spaces near Rio Vista. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Rio Vista, CA",
    lat: 38.1527,
    lng: -121.6952,
    max_capacity: 300,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Ripon, CA ---
  {
    id: 632,
    organization_id: 1,
    title: "Ripon Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-18 16:00:00",
    end_time: "2026-09-18 18:00:00",
    address: "Ripon, CA",
    lat: 37.7363,
    lng: -121.1291,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Riverbank, CA ---
  {
    id: 633,
    organization_id: 2,
    title: "Riverbank 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "Riverbank, CA",
    lat: 37.723,
    lng: -120.9399,
    max_capacity: 403,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Riverside, CA ---
  {
    id: 634,
    organization_id: 3,
    title: "Riverside Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-13 11:00:00",
    end_time: "2026-04-13 13:00:00",
    address: "Riverside, CA",
    lat: 33.9502,
    lng: -117.3992,
    max_capacity: 319,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 635,
    organization_id: 4,
    title: "Riverside Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-20 13:00:00",
    end_time: "2026-07-20 16:00:00",
    address: "Riverside, CA",
    lat: 33.9502,
    lng: -117.3992,
    max_capacity: 520,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 636,
    organization_id: 1,
    title: "Riverside Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-27 15:00:00",
    end_time: "2026-10-27 19:00:00",
    address: "Riverside, CA",
    lat: 33.9502,
    lng: -117.3992,
    max_capacity: 221,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 637,
    organization_id: 2,
    title: "Riverside Trail Run",
    description:
      "Scenic trail run through open spaces near Riverside. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-07 17:00:00",
    end_time: "2026-01-07 19:00:00",
    address: "Riverside, CA",
    lat: 33.9502,
    lng: -117.3992,
    max_capacity: 322,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Rocklin, CA ---
  {
    id: 638,
    organization_id: 3,
    title: "Rocklin Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-25 14:00:00",
    end_time: "2026-07-25 16:00:00",
    address: "Rocklin, CA",
    lat: 38.7863,
    lng: -121.2402,
    max_capacity: 306,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 639,
    organization_id: 4,
    title: "Rocklin Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-05 16:00:00",
    end_time: "2026-10-05 19:00:00",
    address: "Rocklin, CA",
    lat: 38.7863,
    lng: -121.2402,
    max_capacity: 107,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Rohnert Park, CA ---
  {
    id: 640,
    organization_id: 1,
    title: "Rohnert Park Multicultural Festival",
    description:
      "A celebration of Rohnert Park's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-22 17:00:00",
    end_time: "2026-10-22 19:00:00",
    address: "Rohnert Park, CA",
    lat: 38.3375,
    lng: -122.7032,
    max_capacity: 2029,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Rolling Hills, CA ---
  {
    id: 641,
    organization_id: 2,
    title: "Rolling Hills Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Rolling Hills. All skill levels welcome.",
    start_time: "2026-12-03 19:00:00",
    end_time: "2026-12-03 21:00:00",
    address: "Rolling Hills, CA",
    lat: 33.7563,
    lng: -118.3554,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Rolling Hills Estates, CA ---
  {
    id: 642,
    organization_id: 3,
    title: "Rolling Hills Estates Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Rolling Hills Estates, CA",
    lat: 33.7873,
    lng: -118.3661,
    max_capacity: 131,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Rosemead, CA ---
  {
    id: 643,
    organization_id: 4,
    title: "Rosemead Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-24 19:00:00",
    end_time: "2026-12-24 21:00:00",
    address: "Rosemead, CA",
    lat: 34.0824,
    lng: -118.0707,
    max_capacity: 171,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 644,
    organization_id: 1,
    title: "Rosemead Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Rosemead's favorite dog park. Treats provided.",
    start_time: "2026-03-04 09:00:00",
    end_time: "2026-03-04 12:00:00",
    address: "Rosemead, CA",
    lat: 34.0824,
    lng: -118.0707,
    max_capacity: 122,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Roseville, CA ---
  {
    id: 645,
    organization_id: 2,
    title: "Roseville Multicultural Festival",
    description:
      "A celebration of Roseville's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-26 09:00:00",
    end_time: "2026-02-26 11:00:00",
    address: "Roseville, CA",
    lat: 38.754,
    lng: -121.2861,
    max_capacity: 2569,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 646,
    organization_id: 3,
    title: "Roseville Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-06 11:00:00",
    end_time: "2026-05-06 14:00:00",
    address: "Roseville, CA",
    lat: 38.754,
    lng: -121.2861,
    max_capacity: 140,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 647,
    organization_id: 4,
    title: "Roseville 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-08-13 13:00:00",
    end_time: "2026-08-13 17:00:00",
    address: "Roseville, CA",
    lat: 38.754,
    lng: -121.2861,
    max_capacity: 671,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Ross, CA ---
  {
    id: 648,
    organization_id: 1,
    title: "Ross Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-09-24 16:00:00",
    end_time: "2026-09-24 18:00:00",
    address: "Ross, CA",
    lat: 37.9641,
    lng: -122.5521,
    max_capacity: 142,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Sacramento, CA ---
  {
    id: 649,
    organization_id: 2,
    title: "Sacramento Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "Sacramento, CA",
    lat: 38.5838,
    lng: -121.4922,
    max_capacity: 272,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 650,
    organization_id: 3,
    title: "Sacramento Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-20 10:00:00",
    end_time: "2026-04-20 13:00:00",
    address: "Sacramento, CA",
    lat: 38.5838,
    lng: -121.4922,
    max_capacity: 173,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 651,
    organization_id: 4,
    title: "Sacramento Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-27 12:00:00",
    end_time: "2026-07-27 16:00:00",
    address: "Sacramento, CA",
    lat: 38.5838,
    lng: -121.4922,
    max_capacity: 674,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 652,
    organization_id: 1,
    title: "Sacramento Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-07 14:00:00",
    end_time: "2026-10-07 16:00:00",
    address: "Sacramento, CA",
    lat: 38.5838,
    lng: -121.4922,
    max_capacity: 175,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 653,
    organization_id: 2,
    title: "Sacramento Trail Run",
    description:
      "Scenic trail run through open spaces near Sacramento. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-14 16:00:00",
    end_time: "2026-01-14 19:00:00",
    address: "Sacramento, CA",
    lat: 38.5838,
    lng: -121.4922,
    max_capacity: 176,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Saint Helena, CA ---
  {
    id: 654,
    organization_id: 3,
    title: "Saint Helena Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-10 14:00:00",
    end_time: "2026-07-10 16:00:00",
    address: "Saint Helena, CA",
    lat: 38.5077,
    lng: -122.4674,
    max_capacity: 78,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Salinas, CA ---
  {
    id: 655,
    organization_id: 4,
    title: "Salinas Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-16 11:00:00",
    end_time: "2026-04-16 13:00:00",
    address: "Salinas, CA",
    lat: 36.6746,
    lng: -121.6586,
    max_capacity: 319,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 656,
    organization_id: 1,
    title: "Salinas Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-23 13:00:00",
    end_time: "2026-07-23 16:00:00",
    address: "Salinas, CA",
    lat: 36.6746,
    lng: -121.6586,
    max_capacity: 820,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 657,
    organization_id: 2,
    title: "Salinas Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-03 15:00:00",
    end_time: "2026-10-03 19:00:00",
    address: "Salinas, CA",
    lat: 36.6746,
    lng: -121.6586,
    max_capacity: 221,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- San Anselmo, CA ---
  {
    id: 658,
    organization_id: 3,
    title: "San Anselmo Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at San Anselmo's favorite dog park. Treats provided.",
    start_time: "2026-07-16 14:00:00",
    end_time: "2026-07-16 16:00:00",
    address: "San Anselmo, CA",
    lat: 37.9757,
    lng: -122.5606,
    max_capacity: 108,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Bernardino, CA ---
  {
    id: 659,
    organization_id: 4,
    title: "San Bernardino Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-06-09 13:00:00",
    end_time: "2026-06-09 15:00:00",
    address: "San Bernardino, CA",
    lat: 34.109,
    lng: -117.2891,
    max_capacity: 457,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 660,
    organization_id: 1,
    title: "San Bernardino Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-16 15:00:00",
    end_time: "2026-09-16 18:00:00",
    address: "San Bernardino, CA",
    lat: 34.109,
    lng: -117.2891,
    max_capacity: 38,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 661,
    organization_id: 2,
    title: "San Bernardino Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-23 17:00:00",
    end_time: "2026-12-23 21:00:00",
    address: "San Bernardino, CA",
    lat: 34.109,
    lng: -117.2891,
    max_capacity: 159,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 662,
    organization_id: 3,
    title: "San Bernardino Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at San Bernardino's favorite dog park. Treats provided.",
    start_time: "2026-03-03 19:00:00",
    end_time: "2026-03-03 21:00:00",
    address: "San Bernardino, CA",
    lat: 34.109,
    lng: -117.2891,
    max_capacity: 110,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Bruno, CA ---
  {
    id: 663,
    organization_id: 4,
    title: "San Bruno Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-13 08:00:00",
    end_time: "2026-01-13 10:00:00",
    address: "San Bruno, CA",
    lat: 37.6287,
    lng: -122.4129,
    max_capacity: 182,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Carlos, CA ---
  {
    id: 664,
    organization_id: 1,
    title: "San Carlos Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-04-13 11:00:00",
    end_time: "2026-04-13 13:00:00",
    address: "San Carlos, CA",
    lat: 37.5088,
    lng: -122.2588,
    max_capacity: 1267,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- San Clemente, CA ---
  {
    id: 665,
    organization_id: 2,
    title: "San Clemente Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-11 09:00:00",
    end_time: "2026-02-11 11:00:00",
    address: "San Clemente, CA",
    lat: 33.4316,
    lng: -117.6073,
    max_capacity: 297,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 666,
    organization_id: 3,
    title: "San Clemente Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-18 11:00:00",
    end_time: "2026-05-18 14:00:00",
    address: "San Clemente, CA",
    lat: 33.4316,
    lng: -117.6073,
    max_capacity: 38,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- San Diego, CA ---
  {
    id: 667,
    organization_id: 4,
    title: "San Diego Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding San Diego. All paces welcome.",
    start_time: "2026-07-19 14:00:00",
    end_time: "2026-07-19 16:00:00",
    address: "San Diego, CA",
    lat: 32.7177,
    lng: -117.1591,
    max_capacity: 50,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 668,
    organization_id: 1,
    title: "San Diego Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-10-26 16:00:00",
    end_time: "2026-10-26 19:00:00",
    address: "San Diego, CA",
    lat: 32.7177,
    lng: -117.1591,
    max_capacity: 371,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 669,
    organization_id: 2,
    title: "San Diego Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-01-06 18:00:00",
    end_time: "2026-01-06 22:00:00",
    address: "San Diego, CA",
    lat: 32.7177,
    lng: -117.1591,
    max_capacity: 32,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 670,
    organization_id: 3,
    title: "San Diego Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-13 08:00:00",
    end_time: "2026-04-13 10:00:00",
    address: "San Diego, CA",
    lat: 32.7177,
    lng: -117.1591,
    max_capacity: 273,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 671,
    organization_id: 4,
    title: "San Diego Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at San Diego's favorite dog park. Treats provided.",
    start_time: "2026-07-20 10:00:00",
    end_time: "2026-07-20 13:00:00",
    address: "San Diego, CA",
    lat: 32.7177,
    lng: -117.1591,
    max_capacity: 124,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Dimas, CA ---
  {
    id: 672,
    organization_id: 1,
    title: "San Dimas Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "San Dimas, CA",
    lat: 34.1114,
    lng: -117.8034,
    max_capacity: 297,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- San Fernando, CA ---
  {
    id: 673,
    organization_id: 2,
    title: "San Fernando Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-17 15:00:00",
    end_time: "2026-08-17 17:00:00",
    address: "San Fernando, CA",
    lat: 34.286,
    lng: -118.4341,
    max_capacity: 291,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Gabriel, CA ---
  {
    id: 674,
    organization_id: 3,
    title: "San Gabriel Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-17 09:00:00",
    end_time: "2026-02-17 11:00:00",
    address: "San Gabriel, CA",
    lat: 34.0932,
    lng: -118.1087,
    max_capacity: 121,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- San Jacinto, CA ---
  {
    id: 675,
    organization_id: 4,
    title: "San Jacinto Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "San Jacinto, CA",
    lat: 33.7848,
    lng: -116.9574,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 676,
    organization_id: 1,
    title: "San Jacinto Multicultural Festival",
    description:
      "A celebration of San Jacinto's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-24 08:00:00",
    end_time: "2026-02-24 11:00:00",
    address: "San Jacinto, CA",
    lat: 33.7848,
    lng: -116.9574,
    max_capacity: 2863,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- San Joaquin, CA ---
  {
    id: 677,
    organization_id: 2,
    title: "San Joaquin Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-18 19:00:00",
    end_time: "2026-12-18 21:00:00",
    address: "San Joaquin, CA",
    lat: 36.6043,
    lng: -120.1916,
    max_capacity: 1227,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- San Jose, CA ---
  {
    id: 678,
    organization_id: 3,
    title: "San Jose Trail Run",
    description:
      "Scenic trail run through open spaces near San Jose. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-20 12:00:00",
    end_time: "2026-05-20 14:00:00",
    address: "San Jose, CA",
    lat: 37.3332,
    lng: -121.8913,
    max_capacity: 200,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },
  {
    id: 679,
    organization_id: 4,
    title: "San Jose Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-08-27 14:00:00",
    end_time: "2026-08-27 17:00:00",
    address: "San Jose, CA",
    lat: 37.3332,
    lng: -121.8913,
    max_capacity: 2201,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 680,
    organization_id: 1,
    title: "San Jose Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-07 16:00:00",
    end_time: "2026-11-07 20:00:00",
    address: "San Jose, CA",
    lat: 37.3332,
    lng: -121.8913,
    max_capacity: 202,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 681,
    organization_id: 2,
    title: "San Jose Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-02-14 18:00:00",
    end_time: "2026-02-14 20:00:00",
    address: "San Jose, CA",
    lat: 37.3332,
    lng: -121.8913,
    max_capacity: 73,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 682,
    organization_id: 3,
    title: "San Jose Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-21 08:00:00",
    end_time: "2026-05-21 11:00:00",
    address: "San Jose, CA",
    lat: 37.3332,
    lng: -121.8913,
    max_capacity: 184,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- San Juan Bautista, CA ---
  {
    id: 683,
    organization_id: 4,
    title: "San Juan Bautista Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding San Juan Bautista. All paces welcome.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "San Juan Bautista, CA",
    lat: 36.8458,
    lng: -121.5375,
    max_capacity: 30,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- San Juan Capistrano, CA ---
  {
    id: 684,
    organization_id: 1,
    title: "San Juan Capistrano Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "San Juan Capistrano, CA",
    lat: 33.5018,
    lng: -117.6624,
    max_capacity: 111,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- San Leandro, CA ---
  {
    id: 685,
    organization_id: 2,
    title: "San Leandro Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding San Leandro. All paces welcome.",
    start_time: "2026-07-13 14:00:00",
    end_time: "2026-07-13 16:00:00",
    address: "San Leandro, CA",
    lat: 37.7289,
    lng: -122.1521,
    max_capacity: 70,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 686,
    organization_id: 3,
    title: "San Leandro Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-10-20 16:00:00",
    end_time: "2026-10-20 19:00:00",
    address: "San Leandro, CA",
    lat: 37.7289,
    lng: -122.1521,
    max_capacity: 491,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- San Luis Obispo, CA ---
  {
    id: 687,
    organization_id: 4,
    title: "San Luis Obispo Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-09-18 16:00:00",
    end_time: "2026-09-18 18:00:00",
    address: "San Luis Obispo, CA",
    lat: 35.2806,
    lng: -120.6618,
    max_capacity: 148,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- San Marcos, CA ---
  {
    id: 688,
    organization_id: 1,
    title: "San Marcos Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-14 12:00:00",
    end_time: "2026-05-14 14:00:00",
    address: "San Marcos, CA",
    lat: 33.1416,
    lng: -117.1679,
    max_capacity: 132,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 689,
    organization_id: 2,
    title: "San Marcos Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-21 14:00:00",
    end_time: "2026-08-21 17:00:00",
    address: "San Marcos, CA",
    lat: 33.1416,
    lng: -117.1679,
    max_capacity: 833,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- San Marino, CA ---
  {
    id: 690,
    organization_id: 3,
    title: "San Marino Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-03-21 10:00:00",
    end_time: "2026-03-21 12:00:00",
    address: "San Marino, CA",
    lat: 34.1227,
    lng: -118.1048,
    max_capacity: 1166,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- San Mateo, CA ---
  {
    id: 691,
    organization_id: 4,
    title: "San Mateo Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "San Mateo, CA",
    lat: 37.5643,
    lng: -122.3242,
    max_capacity: 563,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 692,
    organization_id: 1,
    title: "San Mateo Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-03-07 09:00:00",
    end_time: "2026-03-07 12:00:00",
    address: "San Mateo, CA",
    lat: 37.5643,
    lng: -122.3242,
    max_capacity: 464,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 693,
    organization_id: 2,
    title: "San Mateo Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-14 11:00:00",
    end_time: "2026-06-14 15:00:00",
    address: "San Mateo, CA",
    lat: 37.5643,
    lng: -122.3242,
    max_capacity: 465,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- San Pablo, CA ---
  {
    id: 694,
    organization_id: 3,
    title: "San Pablo Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-05 09:00:00",
    end_time: "2026-02-05 11:00:00",
    address: "San Pablo, CA",
    lat: 37.9671,
    lng: -122.3403,
    max_capacity: 497,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- San Rafael, CA ---
  {
    id: 695,
    organization_id: 4,
    title: "San Rafael Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "San Rafael, CA",
    lat: 37.9762,
    lng: -122.5284,
    max_capacity: 277,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 696,
    organization_id: 1,
    title: "San Rafael Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-01-11 19:00:00",
    end_time: "2026-01-11 22:00:00",
    address: "San Rafael, CA",
    lat: 37.9762,
    lng: -122.5284,
    max_capacity: 1278,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- San Ramon, CA ---
  {
    id: 697,
    organization_id: 2,
    title: "San Ramon Farmers Market",
    description:
      "Weekly certified farmers market featuring fresh local produce, artisan foods, and handmade goods from regional vendors.",
    start_time: "2026-09-03 16:00:00",
    end_time: "2026-09-03 18:00:00",
    address: "San Ramon, CA",
    lat: 37.7749,
    lng: -121.983,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Outdoor"],
  },
  {
    id: 698,
    organization_id: 3,
    title: "San Ramon Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of San Ramon. All skill levels welcome.",
    start_time: "2026-12-10 18:00:00",
    end_time: "2026-12-10 21:00:00",
    address: "San Ramon, CA",
    lat: 37.7749,
    lng: -121.983,
    max_capacity: 21,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Sand City, CA ---
  {
    id: 699,
    organization_id: 4,
    title: "Sand City Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-09-03 16:00:00",
    end_time: "2026-09-03 18:00:00",
    address: "Sand City, CA",
    lat: 36.6203,
    lng: -121.8524,
    max_capacity: 116,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Sanger, CA ---
  {
    id: 700,
    organization_id: 1,
    title: "Sanger Flea Market",
    description:
      "Weekend flea market with furniture, collectibles, vintage finds, and local produce. Free entry.",
    start_time: "2026-06-03 13:00:00",
    end_time: "2026-06-03 15:00:00",
    address: "Sanger, CA",
    lat: 36.71,
    lng: -119.554,
    max_capacity: 1173,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Santa Ana, CA ---
  {
    id: 701,
    organization_id: 2,
    title: "Santa Ana Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-18 13:00:00",
    end_time: "2026-06-18 15:00:00",
    address: "Santa Ana, CA",
    lat: 33.7466,
    lng: -117.8666,
    max_capacity: 131,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 702,
    organization_id: 3,
    title: "Santa Ana Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-09-25 15:00:00",
    end_time: "2026-09-25 18:00:00",
    address: "Santa Ana, CA",
    lat: 33.7466,
    lng: -117.8666,
    max_capacity: 122,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 703,
    organization_id: 4,
    title: "Santa Ana Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-12-05 17:00:00",
    end_time: "2026-12-05 21:00:00",
    address: "Santa Ana, CA",
    lat: 33.7466,
    lng: -117.8666,
    max_capacity: 563,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 704,
    organization_id: 1,
    title: "Santa Ana Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-03-12 19:00:00",
    end_time: "2026-03-12 21:00:00",
    address: "Santa Ana, CA",
    lat: 33.7466,
    lng: -117.8666,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Santa Barbara, CA ---
  {
    id: 705,
    organization_id: 2,
    title: "Santa Barbara Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-22 14:00:00",
    end_time: "2026-07-22 16:00:00",
    address: "Santa Barbara, CA",
    lat: 34.4228,
    lng: -119.6962,
    max_capacity: 270,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 706,
    organization_id: 3,
    title: "Santa Barbara Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-02 16:00:00",
    end_time: "2026-10-02 19:00:00",
    address: "Santa Barbara, CA",
    lat: 34.4228,
    lng: -119.6962,
    max_capacity: 271,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Santa Clara, CA ---
  {
    id: 707,
    organization_id: 4,
    title: "Santa Clara Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-20 15:00:00",
    end_time: "2026-08-20 17:00:00",
    address: "Santa Clara, CA",
    lat: 37.3582,
    lng: -121.9511,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 708,
    organization_id: 1,
    title: "Santa Clara Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-11-27 17:00:00",
    end_time: "2026-11-27 20:00:00",
    address: "Santa Clara, CA",
    lat: 37.3582,
    lng: -121.9511,
    max_capacity: 92,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 709,
    organization_id: 2,
    title: "Santa Clara Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-07 19:00:00",
    end_time: "2026-02-07 23:00:00",
    address: "Santa Clara, CA",
    lat: 37.3582,
    lng: -121.9511,
    max_capacity: 18,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Santa Clarita, CA ---
  {
    id: 710,
    organization_id: 3,
    title: "Santa Clarita Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Los Angeles County. Tasting tickets available at the gate.",
    start_time: "2026-10-16 17:00:00",
    end_time: "2026-10-16 19:00:00",
    address: "Santa Clarita, CA",
    lat: 34.3948,
    lng: -118.5395,
    max_capacity: 881,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 711,
    organization_id: 4,
    title: "Santa Clarita Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-23 19:00:00",
    end_time: "2026-01-23 22:00:00",
    address: "Santa Clarita, CA",
    lat: 34.3948,
    lng: -118.5395,
    max_capacity: 102,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 712,
    organization_id: 1,
    title: "Santa Clarita Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-03 09:00:00",
    end_time: "2026-04-03 13:00:00",
    address: "Santa Clarita, CA",
    lat: 34.3948,
    lng: -118.5395,
    max_capacity: 63,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 713,
    organization_id: 2,
    title: "Santa Clarita Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Los Angeles County artists.",
    start_time: "2026-07-10 11:00:00",
    end_time: "2026-07-10 13:00:00",
    address: "Santa Clarita, CA",
    lat: 34.3948,
    lng: -118.5395,
    max_capacity: 284,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },

  // --- Santa Cruz, CA ---
  {
    id: 714,
    organization_id: 3,
    title: "Santa Cruz Art Walk",
    description:
      "Self-guided tour through local galleries and studios showcasing work by Santa Cruz County artists.",
    start_time: "2026-11-17 18:00:00",
    end_time: "2026-11-17 20:00:00",
    address: "Santa Cruz, CA",
    lat: 36.9773,
    lng: -122.0276,
    max_capacity: 282,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art", "Outdoor"],
  },
  {
    id: 715,
    organization_id: 4,
    title: "Santa Cruz Trivia Night",
    description:
      "Themed pub trivia night with prizes for top teams. No registration required — just show up and play.",
    start_time: "2026-02-24 08:00:00",
    end_time: "2026-02-24 11:00:00",
    address: "Santa Cruz, CA",
    lat: 36.9773,
    lng: -122.0276,
    max_capacity: 83,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Santa Fe Springs, CA ---
  {
    id: 716,
    organization_id: 1,
    title: "Santa Fe Springs Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-12 16:00:00",
    end_time: "2026-09-12 18:00:00",
    address: "Santa Fe Springs, CA",
    lat: 33.9462,
    lng: -118.0797,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Santa Maria, CA ---
  {
    id: 717,
    organization_id: 2,
    title: "Santa Maria Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Santa Maria, CA",
    lat: 34.9546,
    lng: -120.4341,
    max_capacity: 866,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 718,
    organization_id: 3,
    title: "Santa Maria Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-06-16 12:00:00",
    end_time: "2026-06-16 15:00:00",
    address: "Santa Maria, CA",
    lat: 34.9546,
    lng: -120.4341,
    max_capacity: 267,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },
  {
    id: 719,
    organization_id: 4,
    title: "Santa Maria Trail Run",
    description:
      "Scenic trail run through open spaces near Santa Maria. Multiple distance options and post-race snacks provided.",
    start_time: "2026-09-23 14:00:00",
    end_time: "2026-09-23 18:00:00",
    address: "Santa Maria, CA",
    lat: 34.9546,
    lng: -120.4341,
    max_capacity: 368,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Santa Monica, CA ---
  {
    id: 720,
    organization_id: 1,
    title: "Santa Monica Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "Santa Monica, CA",
    lat: 34.0164,
    lng: -118.4943,
    max_capacity: 319,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 721,
    organization_id: 2,
    title: "Santa Monica Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-26 13:00:00",
    end_time: "2026-07-26 16:00:00",
    address: "Santa Monica, CA",
    lat: 34.0164,
    lng: -118.4943,
    max_capacity: 1120,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Santa Paula, CA ---
  {
    id: 722,
    organization_id: 3,
    title: "Santa Paula Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-04-16 11:00:00",
    end_time: "2026-04-16 13:00:00",
    address: "Santa Paula, CA",
    lat: 34.3503,
    lng: -119.0632,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Santa Rosa, CA ---
  {
    id: 723,
    organization_id: 4,
    title: "Santa Rosa Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "Santa Rosa, CA",
    lat: 38.4433,
    lng: -122.7112,
    max_capacity: 379,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 724,
    organization_id: 1,
    title: "Santa Rosa Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-02 13:00:00",
    end_time: "2026-07-02 16:00:00",
    address: "Santa Rosa, CA",
    lat: 38.4433,
    lng: -122.7112,
    max_capacity: 880,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 725,
    organization_id: 2,
    title: "Santa Rosa Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-09 15:00:00",
    end_time: "2026-10-09 19:00:00",
    address: "Santa Rosa, CA",
    lat: 38.4433,
    lng: -122.7112,
    max_capacity: 181,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Santee, CA ---
  {
    id: 726,
    organization_id: 3,
    title: "Santee Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-22 14:00:00",
    end_time: "2026-07-22 16:00:00",
    address: "Santee, CA",
    lat: 32.84,
    lng: -116.9723,
    max_capacity: 366,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 727,
    organization_id: 4,
    title: "Santee Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-10-02 16:00:00",
    end_time: "2026-10-02 19:00:00",
    address: "Santee, CA",
    lat: 32.84,
    lng: -116.9723,
    max_capacity: 267,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Saratoga, CA ---
  {
    id: 728,
    organization_id: 1,
    title: "Saratoga 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-04-22 11:00:00",
    end_time: "2026-04-22 13:00:00",
    address: "Saratoga, CA",
    lat: 37.2671,
    lng: -122.0197,
    max_capacity: 683,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Sausalito, CA ---
  {
    id: 729,
    organization_id: 2,
    title: "Sausalito Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Sausalito, CA",
    lat: 37.8564,
    lng: -122.4878,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Scotts Valley, CA ---
  {
    id: 730,
    organization_id: 3,
    title: "Scotts Valley Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-11-23 18:00:00",
    end_time: "2026-11-23 20:00:00",
    address: "Scotts Valley, CA",
    lat: 37.0545,
    lng: -122.0115,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Seal Beach, CA ---
  {
    id: 731,
    organization_id: 4,
    title: "Seal Beach Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-08-20 15:00:00",
    end_time: "2026-08-20 17:00:00",
    address: "Seal Beach, CA",
    lat: 33.7439,
    lng: -118.1023,
    max_capacity: 375,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Seaside, CA ---
  {
    id: 732,
    organization_id: 1,
    title: "Seaside Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-05-02 12:00:00",
    end_time: "2026-05-02 14:00:00",
    address: "Seaside, CA",
    lat: 36.6244,
    lng: -121.8479,
    max_capacity: 106,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Sebastopol, CA ---
  {
    id: 733,
    organization_id: 2,
    title: "Sebastopol Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-18 13:00:00",
    end_time: "2026-06-18 15:00:00",
    address: "Sebastopol, CA",
    lat: 38.4031,
    lng: -122.8226,
    max_capacity: 357,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },

  // --- Selma, CA ---
  {
    id: 734,
    organization_id: 3,
    title: "Selma Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-15 19:00:00",
    end_time: "2026-12-15 21:00:00",
    address: "Selma, CA",
    lat: 36.5663,
    lng: -119.6163,
    max_capacity: 211,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Shafter, CA ---
  {
    id: 735,
    organization_id: 4,
    title: "Shafter Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Shafter. All paces welcome.",
    start_time: "2026-07-04 14:00:00",
    end_time: "2026-07-04 16:00:00",
    address: "Shafter, CA",
    lat: 35.5045,
    lng: -119.2678,
    max_capacity: 70,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Shasta Lake, CA ---
  {
    id: 736,
    organization_id: 1,
    title: "Shasta Lake Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-21 19:00:00",
    end_time: "2026-12-21 21:00:00",
    address: "Shasta Lake, CA",
    lat: 40.6756,
    lng: -122.374,
    max_capacity: 2307,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Sierra Madre, CA ---
  {
    id: 737,
    organization_id: 2,
    title: "Sierra Madre Multicultural Festival",
    description:
      "A celebration of Sierra Madre's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-02-02 09:00:00",
    end_time: "2026-02-02 11:00:00",
    address: "Sierra Madre, CA",
    lat: 34.1581,
    lng: -118.0569,
    max_capacity: 1709,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Signal Hill, CA ---
  {
    id: 738,
    organization_id: 3,
    title: "Signal Hill Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-18 13:00:00",
    end_time: "2026-06-18 15:00:00",
    address: "Signal Hill, CA",
    lat: 33.7993,
    lng: -118.1719,
    max_capacity: 131,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Simi Valley, CA ---
  {
    id: 739,
    organization_id: 4,
    title: "Simi Valley Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-21 19:00:00",
    end_time: "2026-12-21 21:00:00",
    address: "Simi Valley, CA",
    lat: 34.2711,
    lng: -118.7798,
    max_capacity: 1167,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 740,
    organization_id: 1,
    title: "Simi Valley Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-01 09:00:00",
    end_time: "2026-03-01 12:00:00",
    address: "Simi Valley, CA",
    lat: 34.2711,
    lng: -118.7798,
    max_capacity: 118,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 741,
    organization_id: 2,
    title: "Simi Valley Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-08 11:00:00",
    end_time: "2026-06-08 15:00:00",
    address: "Simi Valley, CA",
    lat: 34.2711,
    lng: -118.7798,
    max_capacity: 109,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Solana Beach, CA ---
  {
    id: 742,
    organization_id: 3,
    title: "Solana Beach Craft Beer Tasting",
    description:
      "Sample seasonal and small-batch beers from local breweries. Food pairings available from partnering restaurants.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Solana Beach, CA",
    lat: 32.9895,
    lng: -117.2731,
    max_capacity: 233,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Soledad, CA ---
  {
    id: 743,
    organization_id: 4,
    title: "Soledad Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-07-25 14:00:00",
    end_time: "2026-07-25 16:00:00",
    address: "Soledad, CA",
    lat: 36.427,
    lng: -121.3239,
    max_capacity: 54,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Solvang, CA ---
  {
    id: 744,
    organization_id: 1,
    title: "Solvang Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Solvang's favorite dog park. Treats provided.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Solvang, CA",
    lat: 34.5986,
    lng: -120.1349,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Sonoma, CA ---
  {
    id: 745,
    organization_id: 2,
    title: "Sonoma Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Sonoma, CA",
    lat: 38.2934,
    lng: -122.4565,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Sonora, CA ---
  {
    id: 746,
    organization_id: 3,
    title: "Sonora Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-07-10 14:00:00",
    end_time: "2026-07-10 16:00:00",
    address: "Sonora, CA",
    lat: 37.9822,
    lng: -120.384,
    max_capacity: 184,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- South El Monte, CA ---
  {
    id: 747,
    organization_id: 4,
    title: "South El Monte Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-01-19 08:00:00",
    end_time: "2026-01-19 10:00:00",
    address: "South El Monte, CA",
    lat: 34.0524,
    lng: -118.0476,
    max_capacity: 152,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- South Gate, CA ---
  {
    id: 748,
    organization_id: 1,
    title: "South Gate Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-18 16:00:00",
    end_time: "2026-09-18 18:00:00",
    address: "South Gate, CA",
    lat: 33.9541,
    lng: -118.2126,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 749,
    organization_id: 2,
    title: "South Gate Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-25 18:00:00",
    end_time: "2026-12-25 21:00:00",
    address: "South Gate, CA",
    lat: 33.9541,
    lng: -118.2126,
    max_capacity: 245,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- South Lake Tahoe, CA ---
  {
    id: 750,
    organization_id: 3,
    title: "South Lake Tahoe Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "South Lake Tahoe, CA",
    lat: 38.9372,
    lng: -119.9799,
    max_capacity: 473,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- South Pasadena, CA ---
  {
    id: 751,
    organization_id: 4,
    title: "South Pasadena Community Cleanup & Cookout",
    description:
      "Morning neighborhood cleanup followed by a community cookout. A great way to give back and connect.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "South Pasadena, CA",
    lat: 34.1123,
    lng: -118.1344,
    max_capacity: 162,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- South San Francisco, CA ---
  {
    id: 752,
    organization_id: 1,
    title: "South San Francisco Comedy Showcase",
    description:
      "Stand-up comedy showcase featuring local and touring comedians. Two-drink minimum encouraged.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "South San Francisco, CA",
    lat: 37.6525,
    lng: -122.4099,
    max_capacity: 188,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 753,
    organization_id: 2,
    title: "South San Francisco Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-11 10:00:00",
    end_time: "2026-04-11 13:00:00",
    address: "South San Francisco, CA",
    lat: 37.6525,
    lng: -122.4099,
    max_capacity: 89,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Stanton, CA ---
  {
    id: 754,
    organization_id: 3,
    title: "Stanton Salsa & Latin Dance Night",
    description:
      "An evening of salsa, bachata, and merengue with a free beginner lesson at 7 PM before open dancing.",
    start_time: "2026-05-14 12:00:00",
    end_time: "2026-05-14 14:00:00",
    address: "Stanton, CA",
    lat: 33.8054,
    lng: -117.9905,
    max_capacity: 196,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Stockton, CA ---
  {
    id: 755,
    organization_id: 4,
    title: "Stockton Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-15 16:00:00",
    end_time: "2026-09-15 18:00:00",
    address: "Stockton, CA",
    lat: 37.9591,
    lng: -121.2894,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 756,
    organization_id: 1,
    title: "Stockton Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-22 18:00:00",
    end_time: "2026-12-22 21:00:00",
    address: "Stockton, CA",
    lat: 37.9591,
    lng: -121.2894,
    max_capacity: 165,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 757,
    organization_id: 2,
    title: "Stockton Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Stockton's favorite dog park. Treats provided.",
    start_time: "2026-03-02 08:00:00",
    end_time: "2026-03-02 12:00:00",
    address: "Stockton, CA",
    lat: 37.9591,
    lng: -121.2894,
    max_capacity: 116,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 758,
    organization_id: 3,
    title: "Stockton Outdoor Concert",
    description:
      "Free outdoor concert featuring local bands and musicians performing across multiple stages at the park.",
    start_time: "2026-06-09 10:00:00",
    end_time: "2026-06-09 12:00:00",
    address: "Stockton, CA",
    lat: 37.9591,
    lng: -121.2894,
    max_capacity: 2967,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Suisun City, CA ---
  {
    id: 759,
    organization_id: 4,
    title: "Suisun City Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Suisun City, CA",
    lat: 38.2423,
    lng: -122.0353,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Sunnyvale, CA ---
  {
    id: 760,
    organization_id: 1,
    title: "Sunnyvale Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "Sunnyvale, CA",
    lat: 37.3725,
    lng: -122.0326,
    max_capacity: 1887,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 761,
    organization_id: 2,
    title: "Sunnyvale Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-07 09:00:00",
    end_time: "2026-03-07 12:00:00",
    address: "Sunnyvale, CA",
    lat: 37.3725,
    lng: -122.0326,
    max_capacity: 238,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 762,
    organization_id: 3,
    title: "Sunnyvale Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-06-14 11:00:00",
    end_time: "2026-06-14 15:00:00",
    address: "Sunnyvale, CA",
    lat: 37.3725,
    lng: -122.0326,
    max_capacity: 79,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Susanville, CA ---
  {
    id: 763,
    organization_id: 4,
    title: "Susanville Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-08-02 15:00:00",
    end_time: "2026-08-02 17:00:00",
    address: "Susanville, CA",
    lat: 40.4168,
    lng: -120.6522,
    max_capacity: 455,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Sutter Creek, CA ---
  {
    id: 764,
    organization_id: 1,
    title: "Sutter Creek Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-05 15:00:00",
    end_time: "2026-08-05 17:00:00",
    address: "Sutter Creek, CA",
    lat: 38.3944,
    lng: -120.8048,
    max_capacity: 131,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Taft, CA ---
  {
    id: 765,
    organization_id: 2,
    title: "Taft Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-06 16:00:00",
    end_time: "2026-09-06 18:00:00",
    address: "Taft, CA",
    lat: 35.1416,
    lng: -119.4574,
    max_capacity: 1244,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Tehachapi, CA ---
  {
    id: 766,
    organization_id: 3,
    title: "Tehachapi Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-01 11:00:00",
    end_time: "2026-04-01 13:00:00",
    address: "Tehachapi, CA",
    lat: 35.1303,
    lng: -118.4506,
    max_capacity: 111,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Tehama, CA ---
  {
    id: 767,
    organization_id: 4,
    title: "Tehama Trail Run",
    description:
      "Scenic trail run through open spaces near Tehama. Multiple distance options and post-race snacks provided.",
    start_time: "2026-05-05 12:00:00",
    end_time: "2026-05-05 14:00:00",
    address: "Tehama, CA",
    lat: 40.0242,
    lng: -122.1231,
    max_capacity: 260,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Temecula, CA ---
  {
    id: 768,
    organization_id: 1,
    title: "Temecula Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Temecula. All skill levels welcome.",
    start_time: "2026-12-21 19:00:00",
    end_time: "2026-12-21 21:00:00",
    address: "Temecula, CA",
    lat: 33.4893,
    lng: -117.1527,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 769,
    organization_id: 2,
    title: "Temecula Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-01 09:00:00",
    end_time: "2026-03-01 12:00:00",
    address: "Temecula, CA",
    lat: 33.4893,
    lng: -117.1527,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 770,
    organization_id: 3,
    title: "Temecula Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Riverside County. Tasting tickets available at the gate.",
    start_time: "2026-06-08 11:00:00",
    end_time: "2026-06-08 15:00:00",
    address: "Temecula, CA",
    lat: 33.4893,
    lng: -117.1527,
    max_capacity: 1809,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Temple City, CA ---
  {
    id: 771,
    organization_id: 4,
    title: "Temple City Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Temple City, CA",
    lat: 34.0989,
    lng: -118.0614,
    max_capacity: 164,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Thousand Oaks, CA ---
  {
    id: 772,
    organization_id: 1,
    title: "Thousand Oaks Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-14 09:00:00",
    end_time: "2026-02-14 11:00:00",
    address: "Thousand Oaks, CA",
    lat: 34.1741,
    lng: -118.8341,
    max_capacity: 25,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 773,
    organization_id: 2,
    title: "Thousand Oaks Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-05-21 11:00:00",
    end_time: "2026-05-21 14:00:00",
    address: "Thousand Oaks, CA",
    lat: 34.1741,
    lng: -118.8341,
    max_capacity: 586,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 774,
    organization_id: 3,
    title: "Thousand Oaks Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-08-01 13:00:00",
    end_time: "2026-08-01 17:00:00",
    address: "Thousand Oaks, CA",
    lat: 34.1741,
    lng: -118.8341,
    max_capacity: 187,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Tiburon, CA ---
  {
    id: 775,
    organization_id: 4,
    title: "Tiburon Multicultural Festival",
    description:
      "A celebration of Tiburon's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-15 13:00:00",
    end_time: "2026-06-15 15:00:00",
    address: "Tiburon, CA",
    lat: 37.8872,
    lng: -122.4599,
    max_capacity: 2509,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Torrance, CA ---
  {
    id: 776,
    organization_id: 1,
    title: "Torrance Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Torrance, CA",
    lat: 33.8352,
    lng: -118.3412,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 777,
    organization_id: 2,
    title: "Torrance Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-01 18:00:00",
    end_time: "2026-12-01 21:00:00",
    address: "Torrance, CA",
    lat: 33.8352,
    lng: -118.3412,
    max_capacity: 245,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 778,
    organization_id: 3,
    title: "Torrance Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Torrance's favorite dog park. Treats provided.",
    start_time: "2026-03-08 08:00:00",
    end_time: "2026-03-08 12:00:00",
    address: "Torrance, CA",
    lat: 33.8352,
    lng: -118.3412,
    max_capacity: 96,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Tracy, CA ---
  {
    id: 779,
    organization_id: 4,
    title: "Tracy Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-09-27 16:00:00",
    end_time: "2026-09-27 18:00:00",
    address: "Tracy, CA",
    lat: 37.7362,
    lng: -121.4286,
    max_capacity: 86,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
  {
    id: 780,
    organization_id: 1,
    title: "Tracy 5K Fun Run",
    description:
      "A community 5K open to all fitness levels. Chip-timed with medals for all finishers and post-race refreshments.",
    start_time: "2026-12-07 18:00:00",
    end_time: "2026-12-07 21:00:00",
    address: "Tracy, CA",
    lat: 37.7362,
    lng: -121.4286,
    max_capacity: 317,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Trinidad, CA ---
  {
    id: 781,
    organization_id: 2,
    title: "Trinidad Multicultural Festival",
    description:
      "A celebration of Trinidad's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-10 17:00:00",
    end_time: "2026-10-10 19:00:00",
    address: "Trinidad, CA",
    lat: 41.0607,
    lng: -124.1415,
    max_capacity: 2769,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Truckee, CA ---
  {
    id: 782,
    organization_id: 3,
    title: "Truckee Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-10-19 17:00:00",
    end_time: "2026-10-19 19:00:00",
    address: "Truckee, CA",
    lat: 39.3311,
    lng: -120.1802,
    max_capacity: 141,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Tulare, CA ---
  {
    id: 783,
    organization_id: 4,
    title: "Tulare Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Tulare, CA",
    lat: 36.2032,
    lng: -119.3519,
    max_capacity: 25,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 784,
    organization_id: 1,
    title: "Tulare Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-05-15 11:00:00",
    end_time: "2026-05-15 14:00:00",
    address: "Tulare, CA",
    lat: 36.2032,
    lng: -119.3519,
    max_capacity: 706,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Tulelake, CA ---
  {
    id: 785,
    organization_id: 2,
    title: "Tulelake Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-06-12 13:00:00",
    end_time: "2026-06-12 15:00:00",
    address: "Tulelake, CA",
    lat: 41.9515,
    lng: -121.4819,
    max_capacity: 20,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Turlock, CA ---
  {
    id: 786,
    organization_id: 3,
    title: "Turlock Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-01-16 08:00:00",
    end_time: "2026-01-16 10:00:00",
    address: "Turlock, CA",
    lat: 37.4925,
    lng: -120.8488,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 787,
    organization_id: 4,
    title: "Turlock Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-23 10:00:00",
    end_time: "2026-04-23 13:00:00",
    address: "Turlock, CA",
    lat: 37.4925,
    lng: -120.8488,
    max_capacity: 329,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Tustin, CA ---
  {
    id: 788,
    organization_id: 1,
    title: "Tustin Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-09-06 16:00:00",
    end_time: "2026-09-06 18:00:00",
    address: "Tustin, CA",
    lat: 33.7436,
    lng: -117.8283,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 789,
    organization_id: 2,
    title: "Tustin Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-12-13 18:00:00",
    end_time: "2026-12-13 21:00:00",
    address: "Tustin, CA",
    lat: 33.7436,
    lng: -117.8283,
    max_capacity: 529,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Twentynine Palms, CA ---
  {
    id: 790,
    organization_id: 3,
    title: "Twentynine Palms Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-04-13 11:00:00",
    end_time: "2026-04-13 13:00:00",
    address: "Twentynine Palms, CA",
    lat: 34.136,
    lng: -116.0537,
    max_capacity: 55,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Ukiah, CA ---
  {
    id: 791,
    organization_id: 4,
    title: "Ukiah Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-05-05 12:00:00",
    end_time: "2026-05-05 14:00:00",
    address: "Ukiah, CA",
    lat: 39.15,
    lng: -123.2079,
    max_capacity: 168,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Union City, CA ---
  {
    id: 792,
    organization_id: 1,
    title: "Union City Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-06-06 13:00:00",
    end_time: "2026-06-06 15:00:00",
    address: "Union City, CA",
    lat: 37.5981,
    lng: -122.0391,
    max_capacity: 397,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 793,
    organization_id: 2,
    title: "Union City Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-09-13 15:00:00",
    end_time: "2026-09-13 18:00:00",
    address: "Union City, CA",
    lat: 37.5981,
    lng: -122.0391,
    max_capacity: 598,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Upland, CA ---
  {
    id: 794,
    organization_id: 3,
    title: "Upland Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-01 14:00:00",
    end_time: "2026-07-01 16:00:00",
    address: "Upland, CA",
    lat: 34.1003,
    lng: -117.6456,
    max_capacity: 78,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 795,
    organization_id: 4,
    title: "Upland Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-08 16:00:00",
    end_time: "2026-10-08 19:00:00",
    address: "Upland, CA",
    lat: 34.1003,
    lng: -117.6456,
    max_capacity: 19,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Vacaville, CA ---
  {
    id: 796,
    organization_id: 1,
    title: "Vacaville Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-09-21 16:00:00",
    end_time: "2026-09-21 18:00:00",
    address: "Vacaville, CA",
    lat: 38.36,
    lng: -121.9843,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 797,
    organization_id: 2,
    title: "Vacaville Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-12-01 18:00:00",
    end_time: "2026-12-01 21:00:00",
    address: "Vacaville, CA",
    lat: 38.36,
    lng: -121.9843,
    max_capacity: 285,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 798,
    organization_id: 3,
    title: "Vacaville Dog-Friendly Park Meetup",
    description:
      "Off-leash dog meetup and owner social at Vacaville's favorite dog park. Treats provided.",
    start_time: "2026-03-08 08:00:00",
    end_time: "2026-03-08 12:00:00",
    address: "Vacaville, CA",
    lat: 38.36,
    lng: -121.9843,
    max_capacity: 136,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Vallejo, CA ---
  {
    id: 799,
    organization_id: 4,
    title: "Vallejo Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Vallejo, CA",
    lat: 38.1048,
    lng: -122.2559,
    max_capacity: 557,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 800,
    organization_id: 1,
    title: "Vallejo Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-05-15 11:00:00",
    end_time: "2026-05-15 14:00:00",
    address: "Vallejo, CA",
    lat: 38.1048,
    lng: -122.2559,
    max_capacity: 558,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 801,
    organization_id: 2,
    title: "Vallejo Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-22 13:00:00",
    end_time: "2026-08-22 17:00:00",
    address: "Vallejo, CA",
    lat: 38.1048,
    lng: -122.2559,
    max_capacity: 99,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Ventura, CA ---
  {
    id: 802,
    organization_id: 3,
    title: "Ventura Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-01-19 08:00:00",
    end_time: "2026-01-19 10:00:00",
    address: "Ventura, CA",
    lat: 34.2728,
    lng: -119.2308,
    max_capacity: 632,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 803,
    organization_id: 4,
    title: "Ventura Wellness & Mindfulness Fair",
    description:
      "Booths and workshops covering yoga, meditation, nutrition, and holistic wellness practices.",
    start_time: "2026-04-26 10:00:00",
    end_time: "2026-04-26 13:00:00",
    address: "Ventura, CA",
    lat: 34.2728,
    lng: -119.2308,
    max_capacity: 233,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 804,
    organization_id: 1,
    title: "Ventura Community Block Party",
    description:
      "Annual neighborhood block party with food trucks, lawn games, live DJ, and family-friendly activities.",
    start_time: "2026-07-06 12:00:00",
    end_time: "2026-07-06 16:00:00",
    address: "Ventura, CA",
    lat: 34.2728,
    lng: -119.2308,
    max_capacity: 734,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },

  // --- Vernon, CA ---
  {
    id: 805,
    organization_id: 2,
    title: "Vernon Wine & Cheese Evening",
    description:
      "Curated wine and cheese tasting featuring local vintners and artisan cheese makers.",
    start_time: "2026-08-11 15:00:00",
    end_time: "2026-08-11 17:00:00",
    address: "Vernon, CA",
    lat: 34.0084,
    lng: -118.2178,
    max_capacity: 95,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Victorville, CA ---
  {
    id: 806,
    organization_id: 3,
    title: "Victorville Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Victorville. All skill levels welcome.",
    start_time: "2026-12-09 19:00:00",
    end_time: "2026-12-09 21:00:00",
    address: "Victorville, CA",
    lat: 34.5359,
    lng: -117.2931,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 807,
    organization_id: 4,
    title: "Victorville Yoga in the Park",
    description:
      "Free outdoor yoga session for all levels led by certified instructors. Mats welcome; some available to borrow.",
    start_time: "2026-03-16 09:00:00",
    end_time: "2026-03-16 12:00:00",
    address: "Victorville, CA",
    lat: 34.5359,
    lng: -117.2931,
    max_capacity: 48,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },
  {
    id: 808,
    organization_id: 1,
    title: "Victorville Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in San Bernardino County. Tasting tickets available at the gate.",
    start_time: "2026-06-23 11:00:00",
    end_time: "2026-06-23 15:00:00",
    address: "Victorville, CA",
    lat: 34.5359,
    lng: -117.2931,
    max_capacity: 849,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Villa Park, CA ---
  {
    id: 809,
    organization_id: 2,
    title: "Villa Park Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "Villa Park, CA",
    lat: 33.8188,
    lng: -117.809,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Visalia, CA ---
  {
    id: 810,
    organization_id: 3,
    title: "Visalia Tech Meetup",
    description:
      "Monthly gathering of local developers, designers, and entrepreneurs. Lightning talks and open networking.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "Visalia, CA",
    lat: 36.3273,
    lng: -119.295,
    max_capacity: 81,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 811,
    organization_id: 4,
    title: "Visalia Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-01-11 19:00:00",
    end_time: "2026-01-11 22:00:00",
    address: "Visalia, CA",
    lat: 36.3273,
    lng: -119.295,
    max_capacity: 162,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 812,
    organization_id: 1,
    title: "Visalia Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-18 09:00:00",
    end_time: "2026-04-18 13:00:00",
    address: "Visalia, CA",
    lat: 36.3273,
    lng: -119.295,
    max_capacity: 523,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Vista, CA ---
  {
    id: 813,
    organization_id: 2,
    title: "Vista Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-13 17:00:00",
    end_time: "2026-10-13 19:00:00",
    address: "Vista, CA",
    lat: 33.1955,
    lng: -117.247,
    max_capacity: 15,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 814,
    organization_id: 3,
    title: "Vista Bluegrass Picnic",
    description:
      "Afternoon bluegrass jam in the park. Bring a blanket, pack a picnic, and enjoy live acoustic music.",
    start_time: "2026-01-20 19:00:00",
    end_time: "2026-01-20 22:00:00",
    address: "Vista, CA",
    lat: 33.1955,
    lng: -117.247,
    max_capacity: 306,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Walnut, CA ---
  {
    id: 815,
    organization_id: 4,
    title: "Walnut Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-08 15:00:00",
    end_time: "2026-08-08 17:00:00",
    address: "Walnut, CA",
    lat: 34.02,
    lng: -117.8606,
    max_capacity: 439,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Walnut Creek, CA ---
  {
    id: 816,
    organization_id: 1,
    title: "Walnut Creek Multicultural Festival",
    description:
      "A celebration of Walnut Creek's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-18 13:00:00",
    end_time: "2026-06-18 15:00:00",
    address: "Walnut Creek, CA",
    lat: 37.914,
    lng: -122.0613,
    max_capacity: 2589,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 817,
    organization_id: 2,
    title: "Walnut Creek Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-09-25 15:00:00",
    end_time: "2026-09-25 18:00:00",
    address: "Walnut Creek, CA",
    lat: 37.914,
    lng: -122.0613,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },

  // --- Wasco, CA ---
  {
    id: 818,
    organization_id: 3,
    title: "Wasco Chili Cook-Off",
    description:
      "Teams compete for the title of best chili in Kern County. Tasting tickets available at the gate.",
    start_time: "2026-02-02 09:00:00",
    end_time: "2026-02-02 11:00:00",
    address: "Wasco, CA",
    lat: 35.5904,
    lng: -119.3436,
    max_capacity: 1821,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink"],
  },

  // --- Waterford, CA ---
  {
    id: 819,
    organization_id: 4,
    title: "Waterford Multicultural Festival",
    description:
      "A celebration of Waterford's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-06-27 13:00:00",
    end_time: "2026-06-27 15:00:00",
    address: "Waterford, CA",
    lat: 37.6423,
    lng: -120.76,
    max_capacity: 649,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Watsonville, CA ---
  {
    id: 820,
    organization_id: 1,
    title: "Watsonville Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-02 15:00:00",
    end_time: "2026-08-02 17:00:00",
    address: "Watsonville, CA",
    lat: 36.9091,
    lng: -121.758,
    max_capacity: 439,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 821,
    organization_id: 2,
    title: "Watsonville Half Marathon",
    description:
      "A scenic half marathon through the heart of Watsonville. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-09 17:00:00",
    end_time: "2026-11-09 20:00:00",
    address: "Watsonville, CA",
    lat: 36.9091,
    lng: -121.758,
    max_capacity: 640,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Weed, CA ---
  {
    id: 822,
    organization_id: 3,
    title: "Weed Book Club Social",
    description:
      "Monthly book club gathering open to all. This month's title announced on the event page.",
    start_time: "2026-07-25 14:00:00",
    end_time: "2026-07-25 16:00:00",
    address: "Weed, CA",
    lat: 41.4233,
    lng: -122.3832,
    max_capacity: 42,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- West Covina, CA ---
  {
    id: 823,
    organization_id: 4,
    title: "West Covina Drumline & Percussion Show",
    description:
      "High-energy percussion showcase featuring local drumlines and world music ensembles.",
    start_time: "2026-10-01 17:00:00",
    end_time: "2026-10-01 19:00:00",
    address: "West Covina, CA",
    lat: 34.0733,
    lng: -117.9343,
    max_capacity: 597,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music"],
  },
  {
    id: 824,
    organization_id: 1,
    title: "West Covina Food & Wine Festival",
    description:
      "Local restaurants and wineries gather for an afternoon of tastings, live music, and culinary demonstrations.",
    start_time: "2026-01-08 19:00:00",
    end_time: "2026-01-08 22:00:00",
    address: "West Covina, CA",
    lat: 34.0733,
    lng: -117.9343,
    max_capacity: 1098,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },
  {
    id: 825,
    organization_id: 2,
    title: "West Covina Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-04-15 09:00:00",
    end_time: "2026-04-15 13:00:00",
    address: "West Covina, CA",
    lat: 34.0733,
    lng: -117.9343,
    max_capacity: 179,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- West Hollywood, CA ---
  {
    id: 826,
    organization_id: 3,
    title: "West Hollywood Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-04 17:00:00",
    end_time: "2026-10-04 19:00:00",
    address: "West Hollywood, CA",
    lat: 34.0875,
    lng: -118.3642,
    max_capacity: 15,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- West Sacramento, CA ---
  {
    id: 827,
    organization_id: 4,
    title: "West Sacramento Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "West Sacramento, CA",
    lat: 38.5818,
    lng: -121.5292,
    max_capacity: 463,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 828,
    organization_id: 1,
    title: "West Sacramento Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-11-06 17:00:00",
    end_time: "2026-11-06 20:00:00",
    address: "West Sacramento, CA",
    lat: 38.5818,
    lng: -121.5292,
    max_capacity: 464,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Westlake Village, CA ---
  {
    id: 829,
    organization_id: 2,
    title: "Westlake Village Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-19 11:00:00",
    end_time: "2026-04-19 13:00:00",
    address: "Westlake Village, CA",
    lat: 34.1475,
    lng: -118.819,
    max_capacity: 255,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Westminster, CA ---
  {
    id: 830,
    organization_id: 3,
    title: "Westminster Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "Westminster, CA",
    lat: 33.754,
    lng: -117.9918,
    max_capacity: 71,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },
  {
    id: 831,
    organization_id: 4,
    title: "Westminster Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-03-07 09:00:00",
    end_time: "2026-03-07 12:00:00",
    address: "Westminster, CA",
    lat: 33.754,
    lng: -117.9918,
    max_capacity: 72,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Westmorland, CA ---
  {
    id: 832,
    organization_id: 1,
    title: "Westmorland Jazz Night",
    description:
      "An intimate evening of live jazz featuring local musicians. Light bites and craft cocktails available.",
    start_time: "2026-08-26 15:00:00",
    end_time: "2026-08-26 17:00:00",
    address: "Westmorland, CA",
    lat: 33.0408,
    lng: -115.6178,
    max_capacity: 151,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties", "Music"],
  },

  // --- Wheatland, CA ---
  {
    id: 833,
    organization_id: 2,
    title: "Wheatland Startup Demo Day",
    description:
      "Teams from the local accelerator cohort present their products to investors and the public.",
    start_time: "2026-03-09 10:00:00",
    end_time: "2026-03-09 12:00:00",
    address: "Wheatland, CA",
    lat: 39.01,
    lng: -121.4212,
    max_capacity: 204,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Whittier, CA ---
  {
    id: 834,
    organization_id: 3,
    title: "Whittier Startup Pitch Night",
    description:
      "Early-stage founders pitch to a panel of local investors. Networking reception to follow.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "Whittier, CA",
    lat: 33.977,
    lng: -118.0349,
    max_capacity: 128,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 835,
    organization_id: 4,
    title: "Whittier Science & Tech Expo",
    description:
      "Students and local innovators showcase science projects, robotics, and engineering designs. Open to the public.",
    start_time: "2026-04-11 10:00:00",
    end_time: "2026-04-11 13:00:00",
    address: "Whittier, CA",
    lat: 33.977,
    lng: -118.0349,
    max_capacity: 329,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },

  // --- Wildomar, CA ---
  {
    id: 836,
    organization_id: 1,
    title: "Wildomar Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-14 15:00:00",
    end_time: "2026-08-14 17:00:00",
    address: "Wildomar, CA",
    lat: 33.599,
    lng: -117.2799,
    max_capacity: 251,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Williams, CA ---
  {
    id: 837,
    organization_id: 2,
    title: "Williams Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "Williams, CA",
    lat: 39.1546,
    lng: -122.1497,
    max_capacity: 1047,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Willits, CA ---
  {
    id: 838,
    organization_id: 3,
    title: "Willits Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-03-18 10:00:00",
    end_time: "2026-03-18 12:00:00",
    address: "Willits, CA",
    lat: 39.4087,
    lng: -123.355,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Willows, CA ---
  {
    id: 839,
    organization_id: 4,
    title: "Willows Trail Run",
    description:
      "Scenic trail run through open spaces near Willows. Multiple distance options and post-race snacks provided.",
    start_time: "2026-01-04 08:00:00",
    end_time: "2026-01-04 10:00:00",
    address: "Willows, CA",
    lat: 39.5268,
    lng: -122.1906,
    max_capacity: 280,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Windsor, CA ---
  {
    id: 840,
    organization_id: 1,
    title: "Windsor Vintage Market",
    description:
      "Curated pop-up market featuring vintage clothing, furniture, vinyl records, and antiques from local sellers.",
    start_time: "2026-02-08 09:00:00",
    end_time: "2026-02-08 11:00:00",
    address: "Windsor, CA",
    lat: 38.5501,
    lng: -122.8117,
    max_capacity: 577,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Winters, CA ---
  {
    id: 841,
    organization_id: 2,
    title: "Winters Hiking Club Day",
    description:
      "A guided day hike through the natural areas surrounding Winters. All paces welcome.",
    start_time: "2026-11-14 18:00:00",
    end_time: "2026-11-14 20:00:00",
    address: "Winters, CA",
    lat: 38.5246,
    lng: -121.9733,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Woodlake, CA ---
  {
    id: 842,
    organization_id: 3,
    title: "Woodlake Night Market",
    description:
      "Evening market with local food vendors, handmade goods, live music, and craft beverages.",
    start_time: "2026-12-27 19:00:00",
    end_time: "2026-12-27 21:00:00",
    address: "Woodlake, CA",
    lat: 36.4138,
    lng: -119.0994,
    max_capacity: 947,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    tags: ["Food & Drink", "Music"],
  },

  // --- Woodland, CA ---
  {
    id: 843,
    organization_id: 4,
    title: "Woodland Holiday Craft Fair",
    description:
      "Seasonal craft fair with handmade gifts, artwork, and holiday décor from over 40 local artisans.",
    start_time: "2026-08-08 15:00:00",
    end_time: "2026-08-08 17:00:00",
    address: "Woodland, CA",
    lat: 38.6814,
    lng: -121.7703,
    max_capacity: 679,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },
  {
    id: 844,
    organization_id: 1,
    title: "Woodland Half Marathon",
    description:
      "A scenic half marathon through the heart of Woodland. Certified course, chip timing, and finisher medals.",
    start_time: "2026-11-15 17:00:00",
    end_time: "2026-11-15 20:00:00",
    address: "Woodland, CA",
    lat: 38.6814,
    lng: -121.7703,
    max_capacity: 1180,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports", "Outdoor"],
  },

  // --- Woodside, CA ---
  {
    id: 845,
    organization_id: 2,
    title: "Woodside Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-04 14:00:00",
    end_time: "2026-07-04 16:00:00",
    address: "Woodside, CA",
    lat: 37.4331,
    lng: -122.2504,
    max_capacity: 390,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Yorba Linda, CA ---
  {
    id: 846,
    organization_id: 3,
    title: "Yorba Linda Open Mic Night",
    description:
      "Welcoming stage for musicians, poets, comedians, and spoken-word artists. Sign up at the door.",
    start_time: "2026-07-04 14:00:00",
    end_time: "2026-07-04 16:00:00",
    address: "Yorba Linda, CA",
    lat: 33.8874,
    lng: -117.8143,
    max_capacity: 88,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },
  {
    id: 847,
    organization_id: 4,
    title: "Yorba Linda Watercolor Painting Class",
    description:
      "A beginner-friendly watercolor workshop exploring landscapes and botanicals. All materials provided.",
    start_time: "2026-10-11 16:00:00",
    end_time: "2026-10-11 19:00:00",
    address: "Yorba Linda, CA",
    lat: 33.8874,
    lng: -117.8143,
    max_capacity: 19,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Yountville, CA ---
  {
    id: 848,
    organization_id: 1,
    title: "Yountville Multicultural Festival",
    description:
      "A celebration of Yountville's diverse communities with cultural performances, cuisine, and art.",
    start_time: "2026-10-01 17:00:00",
    end_time: "2026-10-01 19:00:00",
    address: "Yountville, CA",
    lat: 38.3983,
    lng: -122.3649,
    max_capacity: 2109,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    tags: ["Music", "Outdoor"],
  },

  // --- Yreka, CA ---
  {
    id: 849,
    organization_id: 2,
    title: "Yreka Photography Walk",
    description:
      "A guided urban photography walk exploring the visual character of Yreka. All skill levels welcome.",
    start_time: "2026-12-12 19:00:00",
    end_time: "2026-12-12 21:00:00",
    address: "Yreka, CA",
    lat: 41.7311,
    lng: -122.6387,
    max_capacity: 27,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Art"],
  },

  // --- Yuba City, CA ---
  {
    id: 850,
    organization_id: 3,
    title: "Yuba City Coding Workshop",
    description:
      "Hands-on introductory coding workshop covering Python basics. Laptops provided for participants.",
    start_time: "2026-05-23 12:00:00",
    end_time: "2026-05-23 14:00:00",
    address: "Yuba City, CA",
    lat: 39.1438,
    lng: -121.6135,
    max_capacity: 24,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    tags: ["Tech"],
  },
  {
    id: 851,
    organization_id: 4,
    title: "Yuba City Kids Science Day",
    description:
      "Interactive science experiments and demos for kids ages 5–12. Free admission with adult chaperone.",
    start_time: "2026-08-03 14:00:00",
    end_time: "2026-08-03 17:00:00",
    address: "Yuba City, CA",
    lat: 39.1438,
    lng: -121.6135,
    max_capacity: 285,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Yucaipa, CA ---
  {
    id: 852,
    organization_id: 1,
    title: "Yucaipa Movie Night in the Park",
    description:
      "Outdoor screening of a fan-favorite film. Bring a blanket. Popcorn and drinks available on-site.",
    start_time: "2026-04-07 11:00:00",
    end_time: "2026-04-07 13:00:00",
    address: "Yucaipa, CA",
    lat: 34.0289,
    lng: -117.0478,
    max_capacity: 453,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    tags: ["Parties"],
  },
  {
    id: 853,
    organization_id: 2,
    title: "Yucaipa Sustainability Fair",
    description:
      "Local organizations, nonprofits, and vendors share sustainable living tips, green products, and eco resources.",
    start_time: "2026-07-14 13:00:00",
    end_time: "2026-07-14 16:00:00",
    address: "Yucaipa, CA",
    lat: 34.0289,
    lng: -117.0478,
    max_capacity: 304,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    tags: ["Outdoor"],
  },

  // --- Yucca Valley, CA ---
  {
    id: 854,
    organization_id: 3,
    title: "Yucca Valley Indoor Rock Climbing Competition",
    description:
      "Beginner to advanced bouldering competition at the local climbing gym. All ages welcome.",
    start_time: "2026-01-16 08:00:00",
    end_time: "2026-01-16 10:00:00",
    address: "Yucca Valley, CA",
    lat: 34.117,
    lng: -116.4296,
    max_capacity: 66,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    tags: ["Sports"],
  },
];

export const getEvents = async (filters?: {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  // True when searching from the user's GPS location — applies radius distance check
  useUserLocation?: boolean;
  // Exact GPS coordinates — only set in geolocation mode
  coordinates?: { lat: number; lng: number };
  // Radius in miles — only used in geolocation mode
  radius?: number;
  // Bounding box of a selected region — only set in region mode
  regionBounds?: { north: number; south: number; east: number; west: number };
}): Promise<Event[]> => {
  const {
    startDate = "0000-01-01",
    endDate = "9999-12-31",
    eventType = "all",
    useUserLocation = false,
    coordinates,
    radius = 10,
    regionBounds,
  } = filters ?? {};

  return mockEvents.filter((event) => {
    // 1. Date range: event must start on or after startDate and on or before endDate
    const eventDate = event.start_time.split(" ")[0];
    if (eventDate < startDate || eventDate > endDate) return false;

    // 2. Event type: skip check when "all", otherwise event must include the tag
    if (eventType !== "all" && !event.tags.includes(eventType)) return false;

    // 3. Location filter — two mutually exclusive modes:
    if (useUserLocation && coordinates) {
      // Geolocation mode: include only events within the specified radius
      const miles = distanceBetweenLocations(
        coordinates.lat,
        coordinates.lng,
        event.lat,
        event.lng,
      );
      if (miles > radius) return false;
    } else if (!useUserLocation && regionBounds) {
      // Region mode: include only events whose coordinates fall inside the
      // bounding box of the selected city / state / country
      const { north, south, east, west } = regionBounds;
      if (
        event.lat < south ||
        event.lat > north ||
        event.lng < west ||
        event.lng > east
      )
        return false;
    }
    // If neither condition matches (no regionBounds, no coordinates), no location
    // filter is applied — this covers the "United States" default which shows all events.

    return true;
  });
};
