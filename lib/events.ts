import { distanceBetweenLocations } from "./utils";
import { Event } from "./types";

const mockEvents = <Event[]>[
  // --- Northridge, CA ---
  {
    id: 1,
    organization_id: 2,
    title: "CSUN Spring Tech Expo",
    description: "California State University Northridge students and faculty showcase capstone projects, startup ideas, and engineering prototypes. Open to the public.",
    start_time: "2026-05-01 10:00:00",
    end_time: "2026-05-01 16:00:00",
    address: "California State University Northridge, Northridge, CA",
    location_details: "18111 Nordhoff St — Oviatt Library Lawn",
    lat: 34.2412,
    lng: -118.5290,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
  {
    id: 2,
    organization_id: 4,
    title: "Northridge Farmers Market",
    description: "Weekly certified farmers market with fresh produce, artisan breads, local honey, and handcrafted goods from over 40 vendors.",
    start_time: "2026-04-11 08:00:00",
    end_time: "2026-04-11 13:00:00",
    address: "Northridge Fashion Center, Northridge, CA",
    location_details: "9301 Tampa Ave — North parking lot",
    lat: 34.2368,
    lng: -118.5353,
    max_capacity: 600,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
 
  // --- Ventura, CA ---
  {
    id: 3,
    organization_id: 1,
    title: "Ventura Harbor Sunset Concert",
    description: "Free outdoor concert series at Ventura Harbor with local bands spanning rock, soul, and jazz. Food trucks and craft beer on site.",
    start_time: "2026-05-22 17:30:00",
    end_time: "2026-05-22 21:00:00",
    address: "Ventura Harbor Village, Ventura, CA",
    location_details: "1591 Spinnaker Dr — Harbor Cove Beach stage",
    lat: 34.2453,
    lng: -119.2618,
    max_capacity: 1200,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    category: "Music",
  },
  {
    id: 4,
    organization_id: 3,
    title: "Ventura County Half Marathon",
    description: "A scenic half marathon winding through downtown Ventura and along the Pacific Coast Highway. Chip-timed with finisher medals and post-race brunch.",
    start_time: "2026-04-19 07:00:00",
    end_time: "2026-04-19 12:00:00",
    address: "Promenade Park, Ventura, CA",
    location_details: "Start line at the corner of California St & Harbor Blvd",
    lat: 34.2746,
    lng: -119.2332,
    max_capacity: 1500,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    category: "Sports",
  },
 
  // --- Camarillo, CA ---
  {
    id: 5,
    organization_id: 2,
    title: "Camarillo Premium Outlets Night Market",
    description: "A special after-hours night market at the outlets featuring local artisans, food vendors, live acoustic music, and exclusive deals.",
    start_time: "2026-04-25 17:00:00",
    end_time: "2026-04-25 22:00:00",
    address: "Camarillo Premium Outlets, Camarillo, CA",
    location_details: "740 Ventura Blvd — Center Court",
    lat: 34.2157,
    lng: -119.0432,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
 
  // --- Oxnard, CA ---
  {
    id: 6,
    organization_id: 3,
    title: "Strawberry Festival 5K",
    description: "A fun run through the strawberry fields of Oxnard in celebration of the annual Strawberry Festival. All finishers receive a fresh strawberry box.",
    start_time: "2026-05-16 07:30:00",
    end_time: "2026-05-16 11:00:00",
    address: "College Park, Oxnard, CA",
    location_details: "Start at the park's main entrance on Gonzales Rd",
    lat: 34.1975,
    lng: -119.1820,
    max_capacity: 1000,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    category: "Sports",
  },
 
  // --- Thousand Oaks, CA ---
  {
    id: 7,
    organization_id: 1,
    title: "Conejo Valley Tech Summit",
    description: "A one-day summit connecting Conejo Valley's growing tech and biotech community. Panels on AI, healthcare tech, and startup funding.",
    start_time: "2026-04-30 09:00:00",
    end_time: "2026-04-30 17:00:00",
    address: "Hyatt Regency Westlake, Thousand Oaks, CA",
    location_details: "880 S Westlake Blvd — Grand Ballroom",
    lat: 34.1679,
    lng: -118.8509,
    max_capacity: 400,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
 
  // --- Los Angeles (Griffith Park) ---
  {
    id: 8,
    organization_id: 4,
    title: "Griffith Park Sunrise Hike & Yoga",
    description: "A guided sunrise hike up to the Griffith Observatory followed by a group yoga session on the lawn. All levels welcome. Mats provided.",
    start_time: "2026-04-05 05:45:00",
    end_time: "2026-04-05 09:00:00",
    address: "Griffith Observatory, Los Angeles, CA",
    location_details: "2800 E Observatory Rd — meet at the main steps",
    lat: 34.1184,
    lng: -118.3004,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    category: "Outdoor",
  },
 
  // --- Los Angeles (Downtown) ---
  {
    id: 9,
    organization_id: 2,
    title: "DTLA Art & Design Fair",
    description: "Three floors of curated contemporary art, furniture design, and photography from 80+ galleries and independent artists. Free entry on opening night.",
    start_time: "2026-05-08 18:00:00",
    end_time: "2026-05-08 22:00:00",
    address: "The Broad, Los Angeles, CA",
    location_details: "221 S Grand Ave — Ground floor galleries open late",
    lat: 34.0543,
    lng: -118.2503,
    max_capacity: 700,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    category: "Art",
  },
 
  // --- Los Angeles (Hollywood) ---
  {
    id: 10,
    organization_id: 1,
    title: "LA Founders & Investors Mixer",
    description: "Monthly informal meetup connecting LA-based startup founders with angel investors and VCs. No pitches — just conversations.",
    start_time: "2026-03-12 18:30:00",
    end_time: "2026-03-12 21:30:00",
    address: "NeueHouse Hollywood, Los Angeles, CA",
    location_details: "6121 Sunset Blvd — Rooftop Terrace",
    lat: 34.0983,
    lng: -118.3242,
    max_capacity: 200,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
 
  // --- Los Angeles (Silver Lake) ---
  {
    id: 11,
    organization_id: 3,
    title: "Silver Lake Flea & Vintage Market",
    description: "Curated weekend flea market with vintage clothing, vinyl records, ceramics, and handmade goods from 60+ local sellers.",
    start_time: "2026-01-18 09:00:00",
    end_time: "2026-01-18 16:00:00",
    address: "Barnsdall Art Park, Los Angeles, CA",
    location_details: "4800 Hollywood Blvd — Upper terrace lawn",
    lat: 34.1022,
    lng: -118.2975,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    category: "Art",
  },
 
  // --- Los Angeles (Koreatown) ---
  {
    id: 12,
    organization_id: 4,
    title: "Koreatown Night Food Tour",
    description: "A guided two-hour evening food tour through Koreatown's best spots — BBQ, banchan, bingsu, and more. Groups of 15 max per tour.",
    start_time: "2026-06-06 19:00:00",
    end_time: "2026-06-06 21:30:00",
    address: "Koreatown, Los Angeles, CA",
    location_details: "Meet at the corner of 6th St & Vermont Ave",
    lat: 34.0614,
    lng: -118.2978,
    max_capacity: 60,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
 
  // --- Santa Monica, CA ---
  {
    id: 13,
    organization_id: 2,
    title: "Santa Monica Pier Summer Kickoff",
    description: "The annual kickoff to summer on the Santa Monica Pier featuring live bands, carnival games, and a fireworks show over the ocean.",
    start_time: "2026-06-20 15:00:00",
    end_time: "2026-06-20 22:00:00",
    address: "Santa Monica Pier, Santa Monica, CA",
    location_details: "200 Santa Monica Pier — Carousel Park area",
    lat: 34.0100,
    lng: -118.4965,
    max_capacity: 3000,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    category: "Parties",
  },
 
  // --- Pasadena, CA ---
  {
    id: 14,
    organization_id: 1,
    title: "Pasadena Civic Hackathon",
    description: "A 24-hour civic hackathon where teams build tech solutions to real local government challenges. Open to developers, designers, and policy wonks.",
    start_time: "2026-02-28 09:00:00",
    end_time: "2026-03-01 12:00:00",
    address: "Pasadena City Hall, Pasadena, CA",
    location_details: "100 N Garfield Ave — Council Chambers & overflow rooms",
    lat: 34.1478,
    lng: -118.1430,
    max_capacity: 250,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
 
  // --- Long Beach, CA ---
  {
    id: 15,
    organization_id: 3,
    title: "Long Beach Grand Prix Watch Party",
    description: "Official watch party for the Grand Prix weekend with live race feeds, driver Q&As, and exclusive pit lane tours for VIP ticket holders.",
    start_time: "2026-04-12 10:00:00",
    end_time: "2026-04-12 18:00:00",
    address: "Shoreline Drive, Long Beach, CA",
    location_details: "Turn 11 Fan Zone — entry via Pine Ave gate",
    lat: 33.7637,
    lng: -118.1913,
    max_capacity: 2000,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    category: "Sports",
  },
 
  // --- Burbank, CA ---
  {
    id: 16,
    organization_id: 4,
    title: "Burbank Vintage Anime & Collectibles Swap",
    description: "Buy, sell, and trade vintage anime merchandise, action figures, comics, and gaming collectibles. Cosplay welcome.",
    start_time: "2026-03-22 10:00:00",
    end_time: "2026-03-22 17:00:00",
    address: "Burbank Community Center, Burbank, CA",
    location_details: "3201 W Magnolia Blvd — Main Hall",
    lat: 34.1794,
    lng: -118.3234,
    max_capacity: 400,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    category: "Parties",
  },
 
  // --- Glendale, CA ---
  {
    id: 17,
    organization_id: 2,
    title: "Glendale Armenian Food Festival",
    description: "A two-day celebration of Armenian culture and cuisine featuring traditional dishes, live folk music, dance performances, and artisan vendors.",
    start_time: "2026-04-18 11:00:00",
    end_time: "2026-04-18 20:00:00",
    address: "Glendale Civic Auditorium, Glendale, CA",
    location_details: "1401 N Verdugo Rd — Outdoor plaza and main hall",
    lat: 34.1763,
    lng: -118.2564,
    max_capacity: 2500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
 
  // --- San Diego (Downtown) ---
  {
    id: 18,
    organization_id: 1,
    title: "San Diego AI & Machine Learning Conference",
    description: "A two-day conference covering applied ML, LLMs, robotics AI, and ethics in technology. Workshops, demos, and a career fair included.",
    start_time: "2026-06-11 08:30:00",
    end_time: "2026-06-12 17:00:00",
    address: "San Diego Convention Center, San Diego, CA",
    location_details: "111 W Harbor Dr — Hall C",
    lat: 32.7065,
    lng: -117.1622,
    max_capacity: 2000,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
 
  // --- San Diego (Balboa Park) ---
  {
    id: 19,
    organization_id: 4,
    title: "Balboa Park Cultural Arts Festival",
    description: "A weekend arts festival across Balboa Park's museums and plazas featuring live painting, sculpture, theater, and world music performances.",
    start_time: "2026-05-30 10:00:00",
    end_time: "2026-05-30 19:00:00",
    address: "Balboa Park, San Diego, CA",
    location_details: "1549 El Prado — Plaza de Panama stage",
    lat: 32.7341,
    lng: -117.1446,
    max_capacity: 5000,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    category: "Art",
  },
 
  // --- San Diego (Pacific Beach) ---
  {
    id: 20,
    organization_id: 3,
    title: "Pacific Beach Volleyball Open",
    description: "Open doubles volleyball tournament on the sand at Pacific Beach. Prizes for top three finishes. Register solo or with a partner.",
    start_time: "2026-02-14 08:00:00",
    end_time: "2026-02-14 17:00:00",
    address: "Pacific Beach, San Diego, CA",
    location_details: "Courts near Grand Ave & Ocean Blvd",
    lat: 32.7990,
    lng: -117.2559,
    max_capacity: 160,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    category: "Sports",
  },
 
  // --- Riverside, CA ---
  {
    id: 21,
    organization_id: 2,
    title: "Riverside Food Truck Roundup",
    description: "Twenty of the Inland Empire's best food trucks converge at Fairmount Park for an afternoon of eats, lawn games, and live DJ sets.",
    start_time: "2026-04-04 12:00:00",
    end_time: "2026-04-04 20:00:00",
    address: "Fairmount Park, Riverside, CA",
    location_details: "2601 Fairmount Blvd — Main lawn near the lake",
    lat: 33.9908,
    lng: -117.3672,
    max_capacity: 1500,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
  {
    id: 22,
    organization_id: 1,
    title: "IE Tech & Startup Expo",
    description: "The Inland Empire's flagship startup and technology showcase. Demos, investor panels, and a pitch competition with $10,000 in prizes.",
    start_time: "2026-06-27 09:00:00",
    end_time: "2026-06-27 18:00:00",
    address: "Riverside Convention Center, Riverside, CA",
    location_details: "3443 Orange St — Main Exhibition Hall",
    lat: 33.9773,
    lng: -117.3741,
    max_capacity: 800,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
  },
 
  // --- San Jacinto, CA ---
  {
    id: 23,
    organization_id: 3,
    title: "San Jacinto Mountain Trail Challenge",
    description: "A trail run and hiking challenge through the San Jacinto Mountains. Choose from 5K, 10K, or 15-mile routes. Shuttle from downtown San Jacinto provided.",
    start_time: "2026-03-07 06:30:00",
    end_time: "2026-03-07 14:00:00",
    address: "San Jacinto State Park, San Jacinto, CA",
    location_details: "25905 CA-243 — Trailhead parking area",
    lat: 33.8212,
    lng: -116.9139,
    max_capacity: 300,
    image_url: "/mock-event-assets/mockEventImages/sports.jpg",
    category: "Sports",
  },
  {
    id: 24,
    organization_id: 4,
    title: "San Jacinto Valley Heritage Festival",
    description: "A celebration of the San Jacinto Valley's agricultural and ranching history with a rodeo, live country music, craft vendors, and a chili cook-off.",
    start_time: "2026-01-31 10:00:00",
    end_time: "2026-01-31 19:00:00",
    address: "San Jacinto Valley Fairgrounds, San Jacinto, CA",
    location_details: "1700 7th St — Main arena and grounds",
    lat: 33.7852,
    lng: -116.9613,
    max_capacity: 2000,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    category: "Music",
  },
 
  // --- Temecula, CA ---
  {
    id: 25,
    organization_id: 2,
    title: "Temecula Valley Wine & Jazz Weekend",
    description: "Sip award-winning local wines while live jazz ensembles perform across the vineyard grounds. Gourmet food pairings available.",
    start_time: "2026-05-09 12:00:00",
    end_time: "2026-05-09 19:00:00",
    address: "Wilson Creek Winery, Temecula, CA",
    location_details: "35960 Rancho California Rd — Estate lawn",
    lat: 33.5108,
    lng: -117.1022,
    max_capacity: 600,
    image_url: "/mock-event-assets/mockEventImages/music.jpg",
    category: "Music",
  },
 
  // --- Escondido, CA ---
  {
    id: 26,
    organization_id: 3,
    title: "Escondido Craft Beer & BBQ Festival",
    description: "Sample craft beers from 20 local and regional breweries paired with BBQ from the best pitmasters in San Diego County.",
    start_time: "2026-02-07 13:00:00",
    end_time: "2026-02-07 19:00:00",
    address: "Kit Carson Park, Escondido, CA",
    location_details: "3333 Bear Valley Pkwy — Festival grounds near the amphitheater",
    lat: 33.1411,
    lng: -117.0578,
    max_capacity: 1200,
    image_url: "/mock-event-assets/mockEventImages/food-and-drink.jpg",
    category: "Food & Drink",
  },
 
  // --- Palm Springs, CA ---
  {
    id: 27,
    organization_id: 1,
    title: "Palm Springs Design & Architecture Weekend",
    description: "A curated weekend of modernist architecture tours, interior design pop-ups, and panel discussions celebrating Palm Springs' iconic mid-century aesthetic.",
    start_time: "2026-02-21 09:00:00",
    end_time: "2026-02-22 17:00:00",
    address: "Palm Springs Convention Center, Palm Springs, CA",
    location_details: "277 N Avenida Caballeros — Main lobby",
    lat: 33.8316,
    lng: -116.5452,
    max_capacity: 500,
    image_url: "/mock-event-assets/mockEventImages/art.jpg",
    category: "Art",
  },
 
  // --- Inglewood, CA ---
  {
    id: 28,
    organization_id: 4,
    title: "Inglewood Night Out Block Party",
    description: "Community block party celebrating Inglewood's resurgence with live hip-hop and R&B performances, local food vendors, and a lowrider show.",
    start_time: "2026-07-04 15:00:00",
    end_time: "2026-07-04 23:00:00",
    address: "Edward Vincent Jr. Park, Inglewood, CA",
    location_details: "700 Warren Ln — Main stage near the rec center",
    lat: 33.9617,
    lng: -118.3617,
    max_capacity: 3000,
    image_url: "/mock-event-assets/mockEventImages/parties.jpg",
    category: "Parties",
  },
 
  // --- Santa Barbara, CA ---
  {
    id: 29,
    organization_id: 2,
    title: "Santa Barbara Wine Country Bike Tour",
    description: "A guided cycling tour through Santa Barbara wine country visiting three vineyards with tastings at each. Bikes, helmets, and support van included.",
    start_time: "2026-03-28 09:00:00",
    end_time: "2026-03-28 15:00:00",
    address: "Sunstone Winery, Santa Barbara, CA",
    location_details: "125 N Refugio Rd — Meet at the main entrance",
    lat: 34.5614,
    lng: -120.1214,
    max_capacity: 30,
    image_url: "/mock-event-assets/mockEventImages/outdoor.jpg",
    category: "Outdoor",
  },
 
  // --- Pomona, CA ---
  {
    id: 30,
    organization_id: 3,
    title: "Cal Poly Pomona Robotics & AI Showcase",
    description: "Cal Poly Pomona's annual engineering showcase featuring student-built robots, autonomous vehicles, and AI demonstrations. Open to the public.",
    start_time: "2026-04-17 10:00:00",
    end_time: "2026-04-17 16:00:00",
    address: "Cal Poly Pomona, Pomona, CA",
    location_details: "3801 W Temple Ave — College of Engineering, Bldg 9",
    lat: 34.0574,
    lng: -117.8213,
    max_capacity: 600,
    image_url: "/mock-event-assets/mockEventImages/tech.jpg",
    category: "Tech",
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
    if (eventType !== "all" && event.category !== eventType) return false;

    // 3. Location filter — two mutually exclusive modes:
    if (useUserLocation && coordinates) {
      // Geolocation mode: include only events within the specified radius
      const miles = distanceBetweenLocations(
        coordinates.lat,
        coordinates.lng,
        event.lat!,
        event.lng!,
      );
      if (miles > radius) return false;
    } else if (!useUserLocation && regionBounds) {
      // Region mode: include only events whose coordinates fall inside the
      // bounding box of the selected city / state / country
      const { north, south, east, west } = regionBounds;
      if (
        event.lat! < south ||
        event.lat! > north ||
        event.lng! < west ||
        event.lng! > east
      )
        return false;
    }
    // If neither condition matches (no regionBounds, no coordinates), no location
    // filter is applied — this covers the "United States" default which shows all events.

    return true;
  });
};

