"use client";

// Imports - Node
import Link from "next/link";
import { Search, Loader2, Plus, Filter } from "lucide-react";
import { useState, useEffect } from "react";


// Imports - Local
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

// Types
type MoviePoster = {
  id: number;
  id_tmdb: number;
  title: string;
  year: number;
  plot?: string | null;
  posterBase64?: string | null;
  runtime?: number | null;
  genres: string[];
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
	const [movies, setMovies] = useState<MoviePoster[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [yearRange, setYearRange] = useState<[number, number]>([1970, 2025]);
	const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
	const [favoriteMovie, setFavoriteMovie] = useState("");
	const [selectedRating, setSelectedRating] = useState<number[]>([5]);

	// Fetch movies from movie_posters table on component mount
	useEffect(() => {
		const fetchMovies = async () => {
			try {
				setIsLoading(true);
				// Get movies from the movie_posters table using the Pages Router API
				const response = await fetch("/api/movie-posters?limit=20");
				
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

	// Handler for search functionality
	const handleSearch = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const queryParams = new URLSearchParams();
			
			// Only add query param if search input is not empty
			if (searchQuery.trim()) {
				queryParams.append("query", searchQuery);
			}
			
			// Add selected genres if any are selected
			if (selectedGenres.length > 0) {
				queryParams.append("genres", selectedGenres.join(','));
			}
			
			// Add year range parameters
			if (yearRange[0] !== 1970 || yearRange[1] !== 2025) {
				queryParams.append("minYear", yearRange[0].toString());
				queryParams.append("maxYear", yearRange[1].toString());
			}
			
			queryParams.append("limit", "20");
			
			// Add more query parameters here when API supports them

			const response = await fetch(`/api/movie-posters?${queryParams.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch movies");
			}

			const data = await response.json();
			if (data.success && data.movies.length > 0) {
				setMovies(data.movies);
			} else {
				setMovies([]);
				setError("Sorry we can't find that movie.");
			}
		} catch (error) {
			console.error("Error searching movies:", error);
			setError("Failed to search movies. Please try again later.");
			setMovies([]);
		} finally {
			setIsLoading(false);
		}
	};

	// Handler to add a favorite movie
	const addFavoriteMovie = () => {
		if (favoriteMovie && !favoriteMovies.includes(favoriteMovie)) {
			setFavoriteMovies([...favoriteMovies, favoriteMovie]);
			setFavoriteMovie("");
		}
	};

	// Handler to remove a favorite movie
	const removeFavoriteMovie = (movie: string) => {
		setFavoriteMovies(favoriteMovies.filter(m => m !== movie));
	};

	// Handler to toggle genre selection
	const toggleGenre = (genre: string) => {
		if (selectedGenres.includes(genre)) {
			setSelectedGenres(selectedGenres.filter(g => g !== genre));
		} else {
			setSelectedGenres([...selectedGenres, genre]);
		}
	};

	return (
		<div className="min-h-screen flex justify-center bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
						Movies
					</h1>
				</div>

				<Tabs defaultValue="browse" className="w-full mb-8">
					<TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
						<TabsTrigger value="browse" className="data-[state=active]:bg-white">
							Browse
						</TabsTrigger>
						<TabsTrigger value="guided" className="data-[state=active]:bg-white">
							Advanced Search
						</TabsTrigger>
					</TabsList>

					<TabsContent value="browse" className="mt-6">
						<div className="flex gap-2 mb-6">
							<Input
								placeholder="Search for movies..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-white border-gray-300"
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleSearch();
									}
								}}
							/>
							<Button
								onClick={handleSearch}
								className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
							>
								{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
								Search
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="guided" className="mt-6">
						<Card className="bg-white border-gray-200">
							<CardContent className="pt-6">
								<div className="space-y-6">
									<div>
										<h3 className="text-lg font-medium mb-2">Preferred Genres</h3>
										<div className="flex flex-wrap gap-2">
											{[
												"Action",
												"Adventure",
												"Comedy",
												"Drama",
												"Fantasy",
												"Horror",
												"Mystery",
												"Romance",
												"Sci-Fi",
												"Thriller",
												"Animation",
												"Documentary",
												"Family",
												"War",
												"History",
												"Music",
												"Western",
												"Crime"
											].map((genre) => (
												<Button
													key={genre}
													variant={selectedGenres.includes(genre) ? "default" : "outline"}
													size="sm"
													className={`border-gray-300 ${
														selectedGenres.includes(genre)
															? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
															: "hover:bg-gray-100 hover:text-purple-600"
													}`}
													onClick={() => toggleGenre(genre)}
												>
													{genre}
												</Button>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-lg font-medium mb-2">Release Year Range</h3>
										<div className="px-2">
											<Slider
												defaultValue={[1970, 2025]}
												max={2025}
												min={1920}
												step={1}
												value={yearRange}
												onValueChange={(value) => setYearRange(value as [number, number])}
												className="mb-2"
											/>
											<div className="flex justify-between text-sm text-gray-500">
												<span>{yearRange[0]}</span>
												<span>{yearRange[1]}</span>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-lg font-medium mb-2">Minimum Rating</h3>
										<div className="px-2">
											<Slider
												defaultValue={[5]}
												max={10}
												min={0}
												step={0.5}
												value={selectedRating}
												onValueChange={(value) => setSelectedRating(value)}
												className="mb-2"
											/>
											<div className="flex justify-between text-sm text-gray-500">
												<span>0</span>
												<span>{selectedRating[0]}/10</span>
												<span>10</span>
											</div>
										</div>
									</div>

									<div>
										<h3 className="text-lg font-medium mb-2">Movies You've Enjoyed</h3>
										<div className="flex gap-2 mb-2">
											<Input 
												placeholder="Enter a movie title..." 
												className="bg-white border-gray-300"
												value={favoriteMovie}
												onChange={(e) => setFavoriteMovie(e.target.value)}
												onKeyDown={(e) => {
													if (e.key === 'Enter') {
														addFavoriteMovie();
													}
												}}
											/>
											<Button 
												variant="outline" 
												size="icon" 
												className="border-gray-300"
												onClick={addFavoriteMovie}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
										{favoriteMovies.length > 0 && (
											<div className="flex flex-wrap gap-2">
												{favoriteMovies.map((movie) => (
													<Badge key={movie} variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
														{movie} <span className="ml-2 text-xs cursor-pointer" onClick={() => removeFavoriteMovie(movie)}>×</span>
													</Badge>
												))}
											</div>
										)}
									</div>

									<div>
										<h3 className="text-lg font-medium mb-2">Additional Filters</h3>
										<div className="flex flex-wrap gap-2">
											<Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
												Popular Only
											</Button>
											<Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
												Recent Releases
											</Button>
											<Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
												Award Winners
											</Button>
											<Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-100">
												Classic Movies
											</Button>
										</div>
									</div>

									<Button
										className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
										onClick={handleSearch}
									>
										<Filter className="mr-2 h-4 w-4" /> Apply Filters
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{isLoading ? (
					<div className="flex justify-center items-center py-20">
						<Loader2 className="h-12 w-12 animate-spin text-purple-600" />
					</div>
				) : error ? (
					<div className="text-center py-12">
						<p className="text-red-500 mb-4">{error}</p>
						{error !== "Sorry we can't find that movie." && (
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{fallbackMovies.map((movie) => (
									<MovieCard key={movie.id} movie={movie} />
								))}
							</div>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{movies.map((movie) => (
							<MovieCard 
								key={movie.id} 
								movie={{
									id: movie.id.toString(),
									title: movie.title,
									year: movie.year,
									poster: movie.posterBase64 || "/placeholder.svg?height=450&width=300",
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
