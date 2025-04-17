"use client";

// Imports - Node
import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";

// Imports - Local
import MovieCard from "@/components/movie-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getMovieRecommendations } from "@/lib/ai-recommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample movie data (would be replaced by actual API data)
const sampleMovies = [
	{
		id: 1,
		title: "Inception",
		year: 2010,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action", "Thriller"],
		reason: "Mind-bending sci-fi with complex narrative structure",
	},
	{
		id: 2,
		title: "The Matrix",
		year: 1999,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Action"],
		reason: "Revolutionary sci-fi with philosophical themes",
	},
	{
		id: 3,
		title: "Interstellar",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Adventure"],
		reason: "Epic space journey with emotional depth",
	},
	{
		id: 4,
		title: "Blade Runner 2049",
		year: 2017,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
		reason: "Visually stunning sci-fi noir with existential themes",
	},
	{
		id: 5,
		title: "Arrival",
		year: 2016,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Mystery"],
		reason: "Thought-provoking sci-fi with linguistic focus",
	},
	{
		id: 6,
		title: "Ex Machina",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Thriller"],
		reason: "Intimate AI story with psychological elements",
	},
];

function RecommendationsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState<any[]>([]);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setIsLoading(true);
		try {
			const results = await getMovieRecommendations(searchQuery);
			setRecommendations(results);
		} catch (error) {
			console.error("Error getting recommendations:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex justify-center bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
					Movie Recommendations
				</h1>

				<Tabs defaultValue="search" className="w-full">
					<TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
						<TabsTrigger value="search" className="data-[state=active]:bg-white">
							Search
						</TabsTrigger>
						<TabsTrigger value="guided" className="data-[state=active]:bg-white">
							Guided
						</TabsTrigger>
					</TabsList>

					<TabsContent value="search" className="mt-6">
						<div className="flex gap-2 mb-8">
							<Input
								placeholder="Enter movies, genres, or directors you like..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-white border-gray-300"
							/>
							<Button
								onClick={handleSearch}
								className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
							>
								{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
								Find Movies
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="guided" className="mt-6">
						<Card className="bg-white border-gray-200">
							<CardContent className="pt-6">
								<div className="space-y-4">
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
											].map((genre) => (
												<Button
													key={genre}
													variant="outline"
													size="sm"
													className="border-gray-300 hover:bg-gray-100 hover:text-purple-600"
												>
													{genre}
												</Button>
											))}
										</div>
									</div>

									<div>
										<h3 className="text-lg font-medium mb-2">Movies You've Enjoyed</h3>
										<div className="flex gap-2 mb-2">
											<Input placeholder="Enter a movie title..." className="bg-white border-gray-300" />
											<Button variant="outline" size="icon" className="border-gray-300">
												<Plus className="h-4 w-4" />
											</Button>
										</div>
										<div className="flex flex-wrap gap-2">
											<Button variant="secondary" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
												Inception <span className="ml-2 text-xs">×</span>
											</Button>
											<Button variant="secondary" size="sm" className="bg-gray-100 hover:bg-gray-200 text-gray-800">
												The Matrix <span className="ml-2 text-xs">×</span>
											</Button>
										</div>
									</div>

									<Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
										Generate Recommendations
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				{/* Results Section */}
				<div className="mt-12">
					<h2 className="text-2xl font-bold mb-6">Recommended for You</h2>

					{isLoading ? (
						<div className="flex justify-center items-center py-20">
							<Loader2 className="h-12 w-12 animate-spin text-purple-600" />
						</div>
					) : recommendations.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{recommendations.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{sampleMovies.map((movie) => (
								<MovieCard key={movie.id} movie={movie} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Exports
export { RecommendationsPage as default };
