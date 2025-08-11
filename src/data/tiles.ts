export interface GameTile {
  id: string;
  name: string;
  image: any;
  category: TileCategory;
  rarity: TileRarity;
  description: string;
  contentFilter: boolean;
}

export enum TileCategory {
  SIGHTINGS = 'sightings',
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
  // SIGHTINGS CATEGORY
  {
    id: 'badger_crossing',
    name: 'Deer Crossing Sign',
    image: require('../../assets/images/Deer sign.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Wildlife warning sign',
    contentFilter: true
  },
  {
    id: 'rabbit_sighting',
    name: 'Squirrel Sighting',
    image: require('../../assets/images/Squirrel .webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Wild rabbit spotted',
    contentFilter: true
  },
  {
    id: 'hedgehog_sighting',
    name: 'Hedgehog Sighting',
    image: require('../../assets/images/Hedgehog.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Spiky visitor',
    contentFilter: true
  },
  {
    id: 'squirrel_sighting',
    name: 'Squirrel Sighting',
    image: require('../../assets/images/Squirrel .webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Nutty critter',
    contentFilter: true
  },
  {
    id: 'bird_sighting',
    name: 'Bird Sighting',
    image: require('../../assets/images/Crow.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Feathered friend',
    contentFilter: true
  },
  {
    id: 'stray_cat',
    name: 'Stray Cat',
    image: require('../../assets/images/Stoat.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Wandering feline',
    contentFilter: true
  },
  {
    id: 'deer_sighting',
    name: 'Deer Sighting',
    image: require('../../assets/images/Deer.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Majestic wildlife',
    contentFilter: true
  },
  {
    id: 'deer_antlers',
    name: 'Deer Antlers',
    image: require('../../assets/images/Deer.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Antler collection',
    contentFilter: true
  },
  {
    id: 'turkey_sighting',
    name: 'Turkey Sighting',
    image: require('../../assets/images/Pheasant .webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Wild turkey spotted',
    contentFilter: true
  },
  {
    id: 'fox_sighting',
    name: 'Fox Sighting',
    image: require('../../assets/images/Fox.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Sly fox spotted',
    contentFilter: true
  },
  {
    id: 'mystery_stain',
    name: 'Skunk Sighting',
    image: require('../../assets/images/Skunk .webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.RARE,
    description: 'Striped critter',
    contentFilter: true
  },
  {
    id: 'cow_sighting',
    name: 'Cow in Field',
    image: require('../../assets/images/Cow.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.COMMON,
    description: 'Farm animal',
    contentFilter: false
  },
  {
    id: 'owl_sighting',
    name: 'Owl Perched',
    image: require('../../assets/images/Owl.webp'),
    category: TileCategory.SIGHTINGS,
    rarity: TileRarity.UNCOMMON,
    description: 'Wise night bird',
    contentFilter: false
  },

  // VEHICLES CATEGORY
  {
    id: 'broken_down_car',
    name: 'Broken Down Car',
    image: require('../../assets/images/broken_down_car.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Roadside breakdown',
    contentFilter: false
  },
  {
    id: 'school_bus',
    name: 'School Bus',
    image: require('../../assets/images/Bus.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Public transport',
    contentFilter: false
  },
  {
    id: 'police_car',
    name: 'Police Car',
    image: require('../../assets/images/Police car.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'Law enforcement',
    contentFilter: false
  },
  {
    id: 'campervan',
    name: 'Campervan',
    image: require('../../assets/images/Campervan.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'Mobile adventure',
    contentFilter: false
  },
  {
    id: 'caravan',
    name: 'Caravan',
    image: require('../../assets/images/Caravan.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.COMMON,
    description: 'Mobile home',
    contentFilter: false
  },
  {
    id: 'black_cab',
    name: 'Black Cab',
    image: require('../../assets/images/Black cab.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.UNCOMMON,
    description: 'London taxi',
    contentFilter: false
  },
  {
    id: 'mini_car',
    name: 'Mini Car',
    image: require('../../assets/images/Mini.webp'),
    category: TileCategory.VEHICLES,
    rarity: TileRarity.RARE,
    description: 'Classic British car',
    contentFilter: false
  },

  // ROADSIDE CATEGORY
  {
    id: 'mattress_roadside',
    name: 'Roadside Mattress',
    image: require('../../assets/images/mattress_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Fly-tipped furniture',
    contentFilter: false
  },
  {
    id: 'lost_shoe',
    name: 'Lost Shoe',
    image: require('../../assets/images/lost_shoe_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Sole survivor',
    contentFilter: false
  },
  {
    id: 'dentures_roadside',
    name: 'Dentures',
    image: require('../../assets/images/nappy_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.UNCOMMON,
    description: 'Chompers abandoned',
    contentFilter: false
  },
  {
    id: 'burrito_roadside',
    name: 'Roadside Burrito',
    image: require('../../assets/images/burrito_roadside.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.UNCOMMON,
    description: 'Fast food fatality',
    contentFilter: false
  },
  {
    id: 'bag_for_life',
    name: 'Bag for Life',
    image: require('../../assets/images/bag_for_life.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Ironically abandoned',
    contentFilter: false
  },
  {
    id: 'takeout_container',
    name: 'Takeout Container',
    image: require('../../assets/images/takeout_container_litter.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Litter special',
    contentFilter: false
  },
  {
    id: 'car_parts',
    name: 'Car Parts',
    image: require('../../assets/images/car_parts.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.UNCOMMON,
    description: 'Spare parts scattered',
    contentFilter: false
  },
  {
    id: 'garden_gnome',
    name: 'Garden Gnome',
    image: require('../../assets/images/Gnome.webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.RARE,
    description: 'Lost lawn ornament',
    contentFilter: false
  },
  {
    id: 'coffee_cup',
    name: 'Coffee Cup',
    image: require('../../assets/images/Coffee .webp'),
    category: TileCategory.ROADSIDE,
    rarity: TileRarity.COMMON,
    description: 'Discarded drink',
    contentFilter: false
  },

  // PEOPLE CATEGORY
  {
    id: 'person_running',
    name: 'Person Running',
    image: require('../../assets/images/person_running_roadside.webp'),
    category: TileCategory.PEOPLE,
    rarity: TileRarity.UNCOMMON,
    description: 'Roadside jogger',
    contentFilter: false
  },
  {
    id: 'cyclist',
    name: 'Cyclist',
    image: require('../../assets/images/Bike.webp'),
    category: TileCategory.PEOPLE,
    rarity: TileRarity.COMMON,
    description: 'Two-wheeled transport',
    contentFilter: false
  },

  // INFRASTRUCTURE CATEGORY
  {
    id: 'traffic_jam',
    name: 'Traffic Jam',
    image: require('../../assets/images/Traffic jam.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Heavy congestion',
    contentFilter: false
  },
  {
    id: 'roundabout',
    name: 'Roundabout',
    image: require('../../assets/images/Roundabout.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Circular junction',
    contentFilter: false
  },
  {
    id: 'bridge',
    name: 'Bridge',
    image: require('../../assets/images/Bridge.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'River crossing',
    contentFilter: false
  },
  {
    id: 'gas_station',
    name: 'Gas Station',
    image: require('../../assets/images/Gas station .webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Fuel stop',
    contentFilter: false
  },
  {
    id: 'bus_stop',
    name: 'Bus Stop',
    image: require('../../assets/images/Bus stop .webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Public transport stop',
    contentFilter: false
  },
  {
    id: 'phone_box',
    name: 'Phone Box',
    image: require('../../assets/images/Phone box.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.RARE,
    description: 'Red telephone box',
    contentFilter: false
  },
  {
    id: 'village_sign',
    name: 'Village Sign',
    image: require('../../assets/images/Village sign.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.UNCOMMON,
    description: 'Town boundary',
    contentFilter: false
  },
  {
    id: 'wind_turbines',
    name: 'Wind Turbines',
    image: require('../../assets/images/Wind turbines .webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.UNCOMMON,
    description: 'Green energy',
    contentFilter: false
  },
  {
    id: 'pub',
    name: 'Country Pub',
    image: require('../../assets/images/Pub.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Local watering hole',
    contentFilter: false
  },
  {
    id: 'house',
    name: 'Farmhouse',
    image: require('../../assets/images/House.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Country home',
    contentFilter: false
  },
  {
    id: 'water_tower',
    name: 'Water Tower',
    image: require('../../assets/images/Water tower.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.UNCOMMON,
    description: 'Storage facility',
    contentFilter: false
  },
  {
    id: 'windmill',
    name: 'Windmill',
    image: require('../../assets/images/Wind mill.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.RARE,
    description: 'Historic mill',
    contentFilter: false
  },
  {
    id: 'corn_field',
    name: 'Corn Field',
    image: require('../../assets/images/Corn field.webp'),
    category: TileCategory.INFRASTRUCTURE,
    rarity: TileRarity.COMMON,
    description: 'Agricultural land',
    contentFilter: false
  },

  // SPECIAL CATEGORY
  {
    id: 'free_range_center',
    name: 'FREE SPOT',
    image: require('../../assets/images/Free spot.webp'),
    category: TileCategory.SPECIAL,
    rarity: TileRarity.COMMON,
    description: 'Center tile - Always spotted',
    contentFilter: false
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

export const getFilteredTiles = (contentFilterEnabled: boolean): GameTile[] => {
  return contentFilterEnabled 
    ? GAME_TILES 
    : GAME_TILES.filter(tile => !tile.contentFilter);
};