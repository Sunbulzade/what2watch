// Script to seed the database with sample movie data
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define the movie input type to match Prisma schema
type MovieCreateInput = {
  title: string;
  year: number;
  director?: string | null;
  plot?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  rating?: number | null;
  runtime?: number | null;
  genres: string[];
  cast: string[];
};

async function main() {
  console.log('Starting to seed sample movies...')

  // Clear existing movies before adding new ones
  console.log('Clearing existing movies...')
  await prisma.movie.deleteMany({})

  // Sample movies data
  const movies: MovieCreateInput[] = [
    {
      title: "Inception",
      year: 2010,
      director: "Christopher Nolan",
      plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "/inception.jpg",
      backdropUrl: null,
      rating: 8.8,
      runtime: 148,
      genres: ["Sci-Fi", "Action", "Thriller"],
      cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
    },
    {
      title: "The Matrix",
      year: 1999,
      director: "Lana Wachowski, Lilly Wachowski",
      plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      posterUrl: "/matrix.webp",
      backdropUrl: null,
      rating: 8.7,
      runtime: 136,
      genres: ["Sci-Fi", "Action"],
      cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"]
    },
    {
      title: "Interstellar",
      year: 2014,
      director: "Christopher Nolan",
      plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "/interstellar.jpg",
      backdropUrl: null,
      rating: 8.6,
      runtime: 169,
      genres: ["Sci-Fi", "Drama", "Adventure"],
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"]
    },
    {
      title: "Arrival",
      year: 2016,
      director: "Denis Villeneuve",
      plot: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
      posterUrl: "/arrival.webp",
      backdropUrl: null,
      rating: 7.9,
      runtime: 116,
      genres: ["Sci-Fi", "Drama", "Mystery"],
      cast: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"]
    },
    {
      title: "Blade Runner 2049",
      year: 2017,
      director: "Denis Villeneuve",
      plot: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 8.0,
      runtime: 164,
      genres: ["Sci-Fi", "Drama", "Mystery"],
      cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas"]
    },
    {
      title: "Ex Machina",
      year: 2014,
      director: "Alex Garland",
      plot: "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 7.7,
      runtime: 108,
      genres: ["Sci-Fi", "Drama", "Thriller"],
      cast: ["Alicia Vikander", "Domhnall Gleeson", "Oscar Isaac"]
    },
    {
      title: "The Shawshank Redemption",
      year: 1994,
      director: "Frank Darabont",
      plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 9.3,
      runtime: 142,
      genres: ["Drama"],
      cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"]
    },
    {
      title: "The Godfather",
      year: 1972,
      director: "Francis Ford Coppola",
      plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 9.2,
      runtime: 175,
      genres: ["Crime", "Drama"],
      cast: ["Marlon Brando", "Al Pacino", "James Caan"]
    },
    {
      title: "Pulp Fiction",
      year: 1994,
      director: "Quentin Tarantino",
      plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 8.9,
      runtime: 154,
      genres: ["Crime", "Drama"],
      cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"]
    },
    {
      title: "The Dark Knight",
      year: 2008,
      director: "Christopher Nolan",
      plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "/placeholder.svg?height=450&width=300",
      backdropUrl: null,
      rating: 9.0,
      runtime: 152,
      genres: ["Action", "Crime", "Drama"],
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"]
    }
  ]

  // Insert movies
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
