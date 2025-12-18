export const players = [
  {
    id: 1,
    name: "Virat Kohli",
    role: "Batsman",
    basePrice: 200, // in Lakhs
    image: "/images/virat.png", // Add images to your public folder
    stats: { matches: 237, runs: 7263, average: 37.25 }
  },
  {
    id: 2,
    name: "Jasprit Bumrah",
    role: "Bowler",
    basePrice: 200,
    image: "/images/bumrah.png",
    stats: { matches: 120, wickets: 145, economy: 7.4 }
  },
  {
    id: 3,
    name: "MS Dhoni",
    role: "Wicketkeeper",
    basePrice: 150,
    image: "/images/dhoni.png",
    stats: { matches: 250, runs: 5082, strikeRate: 135.9 }
  },
  // Add more players here...
];
