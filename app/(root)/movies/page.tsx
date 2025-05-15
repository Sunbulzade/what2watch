"use client";

// Imports - Node
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Imports - Local
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";

// Types
type Movie = {
  id: string;
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
  createdAt?: Date;
  updatedAt?: Date;
};

// Fallback movie data (used only if API fails)
const fallbackMovies = [
	{
		id: "1",
		title: "Inception",
		year: 2010,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action", "Thriller"],
	},
	{
		id: "2",
		title: "The Matrix",
		year: 1999,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action"],
	},
	{
		id: "3",
		title: "Interstellar",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Adventure"],
	},
	{
		id: "4",
		title: "Blade Runner 2049",
		year: 2017,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
	},
	{
		id: "5",
		title: "Arrival",
		year: 2016,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
	},
	{
		id: "6",
		title: "Ex Machina",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Thriller"],
	},
];

function MoviesPage() {
	const [movies, setMovies] = useState<Movie[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch movies from database on component mount
	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setIsLoading(true);
				// Get more movies (12) for the movies page
				const response = await fetch("/api/movies?limit=12");
				
				if (!response.ok) {
					throw new Error("Failed to fetch movies from the API");
				}
				
				const data = await response.json();
				
				if (data.success && data.movies.length > 0) {
					setMovies(data.movies);
				} else {
					// If no movies in database or API returns empty array
					setError("No movies found in the database");
				}
			} catch (error) {
				console.error("Error fetching movies:", error);
				setError("Failed to load movies. Please try again later.");
			} finally {
				setIsLoading(false);
			}
		};

		fetchMovies();
	}, []);

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

				{isLoading ? (
					<div className="flex justify-center items-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-purple-600" />
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-red-500 mb-4">{error}</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{fallbackMovies.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</div>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{movies.map((movie) => (
							<MovieCard 
								key={movie.id} 
								movie={{
									id: movie.id,
									title: movie.title,
									year: movie.year,
									poster: movie.posterUrl || "/placeholder.svg?height=450&width=300",
									genres: movie.genres
								}} 
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// Exports
export { MoviesPage as default };
