export interface GameTile {
  id: string;
  name: string;
  image: any;
  category: TileCategory;
  rarity: TileRarity;
  description: string;
  darkHumour: boolean;
}

export enum TileCategory {
  ROADKILL = 'roadkill',
  VEHICLES = 'vehicles',
  ROADSIDE = 'roadside',
  PEOPLE = 'people',
  INFRASTRUCTURE = 'infrastructure',
  SPECIAL = 'special'
}

export enum TileRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare'
}

export const GAME_TILES: GameTile[] = [
  // ROADKILL CATEGORY
  {
    id: 'dead_badger',
    name: 'Dead Badger',
    image: require('../../assets/images/dead_badger_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.COMMON,
    description: 'Classic roadkill - badger pancake',
    darkHumour: true
  },
  {
    id: 'dead_rabbit',
    name: 'Dead Rabbit',
    image: require('../../assets/images/dead_rabbit_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.COMMON,
    description: 'Bunny gone wrong',
    darkHumour: true
  },
  {
    id: 'dead_hedgehog',
    name: 'Dead Hedgehog',
    image: require('../../assets/images/dead_hedgehog_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.COMMON,
    description: 'Spiky splat',
    darkHumour: true
  },
  {
    id: 'dead_squirrel',
    name: 'Dead Squirrel',
    image: require('../../assets/images/dead_squirrel_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.COMMON,
    description: 'Nutty situation',
    darkHumour: true
  },
  {
    id: 'dead_bird',
    name: 'Dead Bird',
    image: require('../../assets/images/dead_bird_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.COMMON,
    description: 'Feathers everywhere',
    darkHumour: true
  },
  {
    id: 'dead_cat',
    name: 'Dead Cat',
    image: require('../../assets/images/dead_cat_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.UNCOMMON,
    description: 'Used up all 9 lives',
    darkHumour: true
  },
  {
    id: 'dead_deer',
    name: 'Dead Deer',
    image: require('../../assets/images/dead_deer_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.UNCOMMON,
    description: 'Venison special',
    darkHumour: true
  },
  {
    id: 'dead_deer_antlers',
    name: 'Deer Antlers',
    image: require('../../assets/images/dead_deer_antlers.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.UNCOMMON,
    description: 'Trophy remains',
    darkHumour: true
  },
  {
    id: 'dead_turkey',
    name: 'Dead Turkey',
    image: require('../../assets/images/dead_turkey_roadkill.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.UNCOMMON,
    description: 'Thanksgiving came early',
    darkHumour: true
  },
  {
    id: 'roadkill_fox',
    name: 'Dead Fox',
    image: require('../../assets/images/roadkill_fox.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.UNCOMMON,
    description: 'Sly no more',
    darkHumour: true
  },
  {
    id: 'roadkill_splatter',
    name: 'Mystery Splatter',
    image: require('../../assets/images/roadkill_splatter.webp'),
    category: TileCategory.ROADKILL,
    rarity: TileRarity.RARE,
    description: 'Unidentifiable carnage',
    darkHumour: true
  },

  // VEHICLES CATEGORY
  {
    id: 'broken_down_car',
    name: 'Broken Down Car',
    image: require('../../assets/images/broken_down_car.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Roadside breakdown',
    darkHumour: false
  },
  {
    id: 'school_bus',
    name: 'School Bus',
    image: require('../../assets/images/school_bus.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Yellow death trap',
    darkHumour: false
  },
  {
    id: 'hazmat_truck',
    name: 'Hazmat Truck',
    image: require('../../assets/images/hazmat_truck.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'Toxic transport',
    darkHumour: false
  },
  {
    id: 'horse_trailer',
    name: 'Horse Trailer',
    image: require('../../assets/images/horse_trailer.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'Horsepower delivery',
    darkHumour: false
  },
  {
    id: 'travel_trailer',
    name: 'Travel Trailer',
    image: require('../../assets/images/travel_trailer.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Mobile home',
    darkHumour: false
  },
  {
    id: 'volkswagen_van',
    name: 'VW Van',
    image: require('../../assets/images/volkswagen_van.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'Hippy wagon',
    darkHumour: false
  },
  {
    id: 'free_estimates_van',
    name: 'Free Estimates Van',
    image: require('../../assets/images/free_estimates_van.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.RARE,
    description: 'Dodgy contractor',
    darkHumour: false
  },

  // ROADSIDE CATEGORY
  {
    id: 'mattress_roadside',
    name: 'Roadside Mattress',
    image: require('../../assets/images/mattress_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Fly-tipped furniture',
    darkHumour: false
  },
  {
    id: 'lost_shoe',
    name: 'Lost Shoe',
    image: require('../../assets/images/lost_shoe_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Sole survivor',
    darkHumour: false
  },
  {
    id: 'dentures_roadside',
    name: 'Dentures',
    image: require('../../assets/images/dentures_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.UNCOMMON,
    description: 'Chompers abandoned',
    darkHumour: false
  },
  {
    id: 'burrito_roadside',
    name: 'Roadside Burrito',
    image: require('../../assets/images/burrito_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.UNCOMMON,
    description: 'Fast food fatality',
    darkHumour: false
  },
  {
    id: 'bag_for_life',
    name: 'Bag for Life',
    image: require('../../assets/images/bag_for_life.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Ironically abandoned',
    darkHumour: false
  },
  {
    id: 'takeout_container',
    name: 'Takeout Container',
    image: require('../../assets/images/takeout_container_litter.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Litter special',
    darkHumour: false
  },
  {
    id: 'shotgun_shells',
    name: 'Shotgun Shells',
    image: require('../../assets/images/shotgun_shells.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.RARE,
    description: 'Spent ammunition',
    darkHumour: true
  },

  // PEOPLE CATEGORY
  {
    id: 'man_peeing_bush',
    name: 'Man Peeing in Bush',
    image: require('../../assets/images/man_peeing_bush.webp'),
    category: TileCategory.PEOPLE,
    rarity: TileRarity.UNCOMMON,
    description: 'Nature calls',
    darkHumour: false
  },
  {
    id: 'person_peeing_roadside',
    name: 'Roadside Relief',
    image: require('../../assets/images/person_peeing_roadside.webp'),
    category: TileCategory.PEOPLE,
    rarity: TileRarity.UNCOMMON,
    description: 'Emergency stop',
    darkHumour: false
  },
  {
    id: 'road_rage_argument',
    name: 'Road Rage Argument',
    image: require('../../assets/images/road_rage_argument.webp'),
    category: TileCategory.PEOPLE,
    rarity: TileRarity.RARE,
    description: 'Heated discussion',
    darkHumour: false
  },

  // INFRASTRUCTURE CATEGORY
  {
    id: 'oil_spill',
    name: 'Oil Spill',
    image: require('../../assets/images/oil_spill.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Slippery situation',
    darkHumour: false
  },
  {
    id: 'tire_tracks_skid',
    name: 'Skid Marks',
    image: require('../../assets/images/tire_tracks_skid.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Panic braking',
    darkHumour: false
  },
  {
    id: 'traffic_cone_tree',
    name: 'Traffic Cone in Tree',
    image: require('../../assets/images/traffic_cone_tree.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.RARE,
    description: 'Gravity defying',
    darkHumour: false
  },
  {
    id: 'layby_rest_stop',
    name: 'Layby Rest Stop',
    image: require('../../assets/images/layby_rest_stop.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Trucker paradise',
    darkHumour: false
  },

  // SPECIAL CATEGORY
  {
    id: 'free_range_center',
    name: 'Free Range',
    image: require('../../assets/images/free_range_logo_square.jpg'),
    category: TileCategory.SPECIAL,
    rarity: TileRarity.COMMON,
    description: 'Dead Centre - Always spotted',
    darkHumour: false
  }
];

export const FREE_RANGE_TILE = GAME_TILES.find(tile => tile.id === 'free_range_center')!;

export const getRandomTiles = (count: number, excludeCenter: boolean = true): GameTile[] => {
  const availableTiles = excludeCenter 
    ? GAME_TILES.filter(tile => tile.category !== TileCategory.SPECIAL)
    : GAME_TILES;
  
  const shuffled = [...availableTiles].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getTilesByCategory = (category: TileCategory): GameTile[] => {
  return GAME_TILES.filter(tile => tile.category === category);
};

export const getTilesByRarity = (rarity: TileRarity): GameTile[] => {
  return GAME_TILES.filter(tile => tile.rarity === rarity);
};

export const getFilteredTiles = (darkHumourEnabled: boolean): GameTile[] => {
  return darkHumourEnabled 
    ? GAME_TILES 
    : GAME_TILES.filter(tile => !tile.darkHumour);
};