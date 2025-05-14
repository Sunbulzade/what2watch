// Imports - Node
import Link from "next/link";
import Image from "next/image";

// Imports - Local
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Star, ArrowLeft, Play } from "lucide-react";

// This would be replaced with actual data fetching in a real application
async function getMovie(id: string) {
	// Sample movie data
	return {
		id: Number.parseInt(id),
		title: "Inception",
		year: 2010,
		director: "Christopher Nolan",
		runtime: 148,
		rating: 8.8,
		poster: "/placeholder.svg?height=600&width=400",
		backdrop: "/placeholder.svg?height=1080&width=1920",
		genres: ["Sci-Fi", "Action", "Thriller"],
		cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy", "Ken Watanabe"],
		plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
		aiInsights: [
			"Features complex narrative structure with multiple layers of reality",
			"Explores themes of memory, grief, and the nature of consciousness",
			"Pioneered innovative visual effects for dream sequences",
			"Combines heist film elements with psychological thriller components",
		],
	};
}

export default async function MoviePage({ params }: { params: { id: string; }; }) {
	const movie = await getMovie(params.id);

	return (
		<div className="min-h-screen bg-white text-gray-900">
			{/* Backdrop Image */}
			<div className="relative h-[50vh] w-full">
				<div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
				<Image src={movie.backdrop || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
				<div className="absolute top-4 left-4 z-20">
					<Button asChild variant="ghost" className="text-gray-900 hover:bg-white/40">
						<Link href="/recommendations">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back
						</Link>
					</Button>
				</div>
			</div>

			<div className="container px-4 -mt-32 relative z-20">
				<div className="flex flex-col md:flex-row gap-8">
					{/* Movie Poster */}
					<div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
						<div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl border border-gray-200">
							<Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
						</div>
						<div className="mt-4 flex flex-col gap-2">
							<Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
								<Heart className="mr-2 h-4 w-4" /> Add to Watchlist
							</Button>
							<Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
								<Play className="mr-2 h-4 w-4" /> Watch Trailer
							</Button>
						</div>
					</div>

					{/* Movie Details */}
					<div className="flex-grow">
						<h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
						<div className="flex items-center gap-4 mb-4 flex-wrap">
							<span className="text-gray-600">{movie.year}</span>
							<div className="flex items-center">
								<Clock className="h-4 w-4 mr-1 text-gray-600" />
								<span className="text-gray-600">{movie.runtime} min</span>
							</div>
							<div className="flex items-center">
								<Star className="h-4 w-4 mr-1 text-yellow-600" />
								<span>{movie.rating}/10</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-2 mb-6">
							{movie.genres.map((genre) => (
								<Badge key={genre} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
									{genre}
								</Badge>
							))}
						</div>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Overview</h2>
							<p className="text-gray-700">{movie.plot}</p>
						</div>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Director</h2>
							<p className="text-gray-700">{movie.director}</p>
						</div>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2">Cast</h2>
							<div className="flex flex-wrap gap-2">
								{movie.cast.map((actor) => (
									<Badge key={actor} variant="outline" className="border-gray-300 bg-gray-100 text-gray-800">
										{actor}
									</Badge>
								))}
							</div>
						</div>

						<div className="mb-6">
							<h2 className="text-xl font-semibold mb-2 flex items-center">
								<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
									AI Insights
								</span>
							</h2>
							<ul className="list-disc list-inside space-y-2 text-gray-700">
								{movie.aiInsights.map((insight, index) => (
									<li key={index}>{insight}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
