// Imports - Node
import Link from "next/link";
import { Search } from "lucide-react";

// Imports - Local
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";

// Sample movie data (would be replaced by actual API data)
const popularMovies = [
	{
		id: 1,
		title: "Inception",
		year: 2010,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action", "Thriller"],
	},
	{
		id: 2,
		title: "The Matrix",
		year: 1999,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action"],
	},
	{
		id: 3,
		title: "Interstellar",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Adventure"],
	},
	{
		id: 4,
		title: "Blade Runner 2049",
		year: 2017,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
	},
	{
		id: 5,
		title: "Arrival",
		year: 2016,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
	},
	{
		id: 6,
		title: "Ex Machina",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Thriller"],
	},
];

function MoviesPage() {
	return (
		<div className="min-h-screen flex justify-center bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
						Movies
					</h1>
					<Button
						asChild
						className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
					>
						<Link href="/recommendations">
							<Search className="mr-2 h-4 w-4" /> Find Recommendations
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{popularMovies.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))}
				</div>
			</div>
		</div>
	);
}

// Exports
export { MoviesPage as default };
