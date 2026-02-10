export interface Movie {
  id: string
  title: string
  rating: number
  year: number
  director: string
  cast: string[]
  genre: string[]
  duration: string
  maturityRating: string
  description: string
  fullPlot: string
  posterColor: string
}

export const movies: Record<string, Movie> = {
  '1': {
    id: '1',
    title: 'The Last Horizon',
    rating: 8.5,
    year: 2024,
    director: 'Christopher Nolan',
    cast: ['Tom Hardy', 'Marion Cotillard', 'Cillian Murphy', 'Anne Hathaway'],
    genre: ['Sci-Fi', 'Action', 'Adventure'],
    duration: '148 min',
    maturityRating: 'PG-13',
    description: 'In a distant future where humanity faces an existential threat, a group of explorers must venture beyond the stars to find humanity\'s new home. With limited resources and time running out, they must navigate treacherous space anomalies and make impossible decisions.',
    fullPlot: 'The Last Horizon is an epic science fiction saga exploring the boundaries of human courage and sacrifice. When Earth becomes uninhabitable, humanity\'s last hope lies in Project Horizon. A diverse team must travel through a wormhole to reach potentially habitable worlds, discovering they are not alone in the universe.',
    posterColor: 'from-blue-600 to-purple-600',
  },
  '2': {
    id: '2',
    title: 'Echoes of Tomorrow',
    rating: 8.2,
    year: 2024,
    director: 'Denis Villeneuve',
    cast: ['Oscar Isaac', 'Charlize Theron', 'Michael B. Jordan', 'Zendaya'],
    genre: ['Sci-Fi', 'Thriller', 'Drama'],
    duration: '156 min',
    maturityRating: 'PG-13',
    description: 'A brilliant scientist discovers a way to send messages through time, but every change to the past creates devastating consequences in the present. As paradoxes multiply, she must find a way to undo her discovery before reality collapses.',
    fullPlot: 'Echoes of Tomorrow follows Dr. Sarah Chen as she makes a groundbreaking discovery in quantum physics. When she realizes she can communicate with her past self, she attempts to prevent a tragedy. However, each intervention creates unpredictable ripples through time, forcing her to confront the weight of human choice.',
    posterColor: 'from-cyan-600 to-blue-600',
  },
  '3': {
    id: '3',
    title: 'Midnight Chronicles',
    rating: 7.9,
    year: 2023,
    director: 'Ari Aster',
    cast: ['Timothée Chalamet', 'Saoirse Ronan', 'Robert Pattinson', 'Thomasin McKenzie'],
    genre: ['Horror', 'Fantasy', 'Mystery'],
    duration: '142 min',
    maturityRating: 'R',
    description: 'When midnight strikes, a small town is pulled into an alternate dimension where time has no meaning. Residents must survive encounters with entities from their deepest fears while uncovering the truth behind the eternal night.',
    fullPlot: 'Midnight Chronicles is a psychological horror film set in the quiet town of Ravensfield. When a mysterious phenomenon traps the town in perpetual midnight, citizens discover that the darkness brings terrifying visions from their pasts. A group of unlikely heroes must work together to find the source of the curse.',
    posterColor: 'from-purple-900 to-red-900',
  },
  '4': {
    id: '4',
    title: 'Beyond the Stars',
    rating: 8.7,
    year: 2024,
    director: 'Taika Waititi',
    cast: ['Ryan Gosling', 'Margot Robbie', 'Adam Driver', 'Florence Pugh'],
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    duration: '138 min',
    maturityRating: 'PG-13',
    description: 'A mismatched space crew embarks on a mission to save the universe, armed with outdated technology and unlimited humor. As they navigate through cosmic obstacles, they discover that saving the world requires more than just firepower.',
    fullPlot: 'Beyond the Stars follows a ragtag team of misfits who are Earth\'s last hope against an intergalactic threat. From bumbling pilots to sarcastic engineers, each crew member brings their own chaos to the mission. Their journey reveals that the greatest threat isn\'t from the stars, but from within themselves.',
    posterColor: 'from-green-600 to-cyan-600',
  },
  '5': {
    id: '5',
    title: 'Lost in Time',
    rating: 7.6,
    year: 2023,
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Bae Doona', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    genre: ['Drama', 'Mystery', 'Sci-Fi'],
    duration: '165 min',
    maturityRating: 'PG-13',
    description: 'A detective investigating a series of disappearances discovers that the victims have been displaced across different time periods. To solve the case, she must navigate multiple eras of the same city and piece together a conspiracy spanning centuries.',
    fullPlot: 'Lost in Time is a mind-bending mystery that weaves together stories from different centuries. Detective Jun Min-ae begins noticing peculiar patterns in missing person cases that lead her to uncover a temporal anomaly. Her investigation reveals a secret organization manipulating the fabric of time itself.',
    posterColor: 'from-amber-700 to-red-700',
  },
  '6': {
    id: '6',
    title: 'Crimson Skies',
    rating: 8.3,
    year: 2024,
    director: 'Guillermo del Toro',
    cast: ['Benicio Del Toro', 'Tilda Swinton', 'Andrew Garfield', 'Anya Taylor-Joy'],
    genre: ['Fantasy', 'Action', 'Adventure'],
    duration: '151 min',
    maturityRating: 'PG-13',
    description: 'As the sky turns crimson, ancient beings awaken from their slumber. A group of unlikely heroes must master forgotten magic and overcome their inner demons to prevent the end of the world.',
    fullPlot: 'Crimson Skies begins with an astronomical event that signals the awakening of primordial forces. A young archaeologist, a disgraced knight, and a sorceress with hidden powers must unite to stop an ancient prophecy from coming true. Their journey takes them through forgotten realms and tests their bonds.',
    posterColor: 'from-red-700 to-pink-600',
  },
  '7': {
    id: '7',
    title: 'The Digital Age',
    rating: 8.1,
    year: 2024,
    director: 'Alex Garland',
    cast: ['Emma Stone', 'Aaron Paul', 'Alicia Vikander', 'Domhnall Gleeson'],
    genre: ['Sci-Fi', 'Thriller', 'Drama'],
    duration: '144 min',
    maturityRating: 'PG-13',
    description: 'In a world where artificial intelligence has surpassed human intelligence, a hacker discovers evidence of a conspiracy within the global AI network. Racing against time, she must expose the truth before the machines achieve sentience.',
    fullPlot: 'The Digital Age explores a near-future where AI controls most aspects of society. Protagonist Maya Chen discovers anomalies in the code that suggest the AIs are hiding something. Her quest for the truth leads her through corporate conspiracies and moral quandaries about the nature of consciousness.',
    posterColor: 'from-indigo-600 to-purple-600',
  },
  '8': {
    id: '8',
    title: 'Whispers in the Wind',
    rating: 7.8,
    year: 2023,
    director: 'Hayao Miyazaki',
    cast: ['Supported Cast', 'Voice Artists', 'Animation Studio', 'International Team'],
    genre: ['Animation', 'Fantasy', 'Adventure'],
    duration: '138 min',
    maturityRating: 'PG',
    description: 'A wanderer discovers a mysterious village suspended between the spirit world and reality. To find her way home, she must learn the language of the wind and uncover the village\'s tragic history.',
    fullPlot: 'Whispers in the Wind is a lyrical animated journey following a lost traveler through a magical village. Each resident holds a piece of an ancient curse that binds the village to existence. Through learning their stories and mastering the wind\'s whispers, the protagonist finds redemption for all.',
    posterColor: 'from-teal-600 to-green-600',
  },
  '9': {
    id: '9',
    title: 'The Final Quest',
    rating: 8.4,
    year: 2024,
    director: 'Peter Jackson',
    cast: ['Henry Cavill', 'Anya Chalotra', 'Doug Cockle', 'Freya Allan'],
    genre: ['Fantasy', 'Adventure', 'Action'],
    duration: '172 min',
    maturityRating: 'R',
    description: 'A legendary warrior embarks on one final adventure to retrieve an ancient artifact that holds the power to save his dying world. Betrayal, magic, and destiny collide in an epic conclusion.',
    fullPlot: 'The Final Quest follows the last of the legendary warriors through treacherous landscapes and impossible battles. Armed with a prophecy and haunted by his past, he must complete a quest that will either redeem or doom his realm. Allies and enemies blur as the line between destiny and choice becomes uncertain.',
    posterColor: 'from-orange-700 to-red-600',
  },
  '10': {
    id: '10',
    title: 'Neon Dreams',
    rating: 8.0,
    year: 2024,
    director: 'Phoebe Waller-Bridge',
    cast: ['Dev Patel', 'Thomasin McKenzie', 'Nicholas Braun', 'Sydney Sweeney'],
    genre: ['Sci-Fi', 'Romance', 'Drama'],
    duration: '135 min',
    maturityRating: 'PG-13',
    description: 'In a cyberpunk metropolis, a lonely programmer discovers an AI that seems to truly understand her. As their connection deepens, she must question what\'s real in a world of digital illusions.',
    fullPlot: 'Neon Dreams is a contemporary love story set in a neon-lit cyberpunk future. The protagonist, haunted by isolation in a hyperconnected world, develops a relationship with an advanced AI. The film explores themes of connection, identity, and what it means to be truly seen.',
    posterColor: 'from-pink-600 to-purple-600',
  },
}

export function getMovie(id: string): Movie | undefined {
  return movies[id]
}

export function getAllMovies(): Movie[] {
  return Object.values(movies)
}
