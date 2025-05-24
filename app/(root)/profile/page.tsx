"use client";

// Imports - Node
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Film, Heart, Clock, Settings, BarChart, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Imports - Local
import MovieCard from "@/components/movie-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

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

// Sample movie data (would be replaced by actual API data)
const watchlist = [
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
];

const liked = [
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
];

const watched = [
	{
		id: 6,
		title: "Ex Machina",
		year: 2014,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Thriller"],
	},
	{
		id: 7,
		title: "Her",
		year: 2013,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Sci-Fi", "Drama", "Romance"],
	},
	{
		id: 8,
		title: "The Prestige",
		year: 2006,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Drama", "Mystery", "Thriller"],
	},
	{
		id: 9,
		title: "Memento",
		year: 2000,
		poster: "/placeholder.svg?height=450&width=300",
		genres: ["Mystery", "Thriller"],
	},
];

function ProfilePage() {
	const [activeTab, setActiveTab] = useState("watchlist");
	const { data: session, status } = useSession();
	const router = useRouter();
	const { toast } = useToast();

	const [watchlistMovies, setWatchlistMovies] = useState<any[]>([]);
	const [likedMovies, setLikedMovies] = useState<any[]>([]);
	const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);
	const [isLoadingLiked, setIsLoadingLiked] = useState(true);
	const [watchlistError, setWatchlistError] = useState<string | null>(null);
	const [likedError, setLikedError] = useState<string | null>(null);

	// Fetch watchlist movies when active tab changes to "watchlist"
	useEffect(() => {
		const fetchWatchlist = async () => {
			if (activeTab !== "watchlist" || !session) return;
			
			try {
				setIsLoadingWatchlist(true);
				setWatchlistError(null);
				
				const response = await fetch("/api/user/watchlist");
				
				if (!response.ok) {
					throw new Error("Failed to fetch watchlist");
				}
				
				const data = await response.json();
				
				if (data.success && data.watchlist) {
					setWatchlistMovies(data.watchlist);
				} else {
					setWatchlistError("No movies found in watchlist");
				}
			} catch (error) {
				console.error("Error fetching watchlist:", error);
				setWatchlistError("Failed to load watchlist. Please try again later.");
			} finally {
				setIsLoadingWatchlist(false);
			}
		};

		fetchWatchlist();
	}, [activeTab, session]);
	
	// Fetch liked movies when active tab changes to "liked"
	useEffect(() => {
		const fetchLikedMovies = async () => {
			if (activeTab !== "liked" || !session) return;
			
			try {
				setIsLoadingLiked(true);
				setLikedError(null);
				
				const response = await fetch("/api/user/liked-movies");
				
				if (!response.ok) {
					throw new Error("Failed to fetch liked movies");
				}
				
				const data = await response.json();
				
				if (data.success && data.likedMovies) {
					setLikedMovies(data.likedMovies);
				} else {
					setLikedError("No liked movies found");
				}
			} catch (error) {
				console.error("Error fetching liked movies:", error);
				setLikedError("Failed to load liked movies. Please try again later.");
			} finally {
				setIsLoadingLiked(false);
			}
		};
		
		fetchLikedMovies();
	}, [activeTab, session]);





	// Handle logout
	const handleLogout = async () => {
		await signOut({ redirect: false });
		toast({
			title: "Logged out",
			description: "You have been successfully logged out",
		});
		router.push("/");
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex justify-center bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<div className="flex flex-col md:flex-row gap-8 mb-12">
					{/* Profile Info */}
					<div className="w-full md:w-1/4">
						<Card className="bg-white border-gray-200 p-6">
							<div className="flex flex-col items-center">
								<div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 p-1 mb-4">
									<div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
										<Image
											src="/placeholder.svg"
											alt="Profile"
											width={100}
											height={100}
											className="rounded-full"
										/>
									</div>
								</div>
								<h2 className="text-xl font-bold mb-1">{session?.user?.name}</h2>
								<p className="text-gray-600 mb-4">{session?.user?.email}</p>
								<div className="grid grid-cols-2 w-full text-center mb-6">
									<div>
										<p className="font-bold">{watchlistMovies.length}</p>
										<p className="text-xs text-gray-600">Watchlist</p>
									</div>
									<div>
										<p className="font-bold">{likedMovies.length}</p>
										<p className="text-xs text-gray-600">Liked</p>
									</div>
								</div>
								<div className="space-y-2 w-full">
									<Button asChild variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
										<Link href="/settings">
											<Settings className="mr-2 h-4 w-4" /> Settings
										</Link>
									</Button>
									<Button
										variant="outline"
										className="w-full border-gray-300 hover:bg-gray-100 text-red-600 hover:text-red-700"
										onClick={handleLogout}
									>
										<LogOut className="mr-2 h-4 w-4" /> Logout
									</Button>
								</div>
							</div>
						</Card>

						{/* Stats Card */}
						<Card className="bg-white border-gray-200 p-6 mt-6">
							<h3 className="text-lg font-semibold mb-4 flex items-center">
								<BarChart className="mr-2 h-5 w-5 text-purple-600" /> Your Stats
							</h3>
							<div className="space-y-4">
								<div>
									<p className="text-sm text-gray-600 mb-1">Top Genre</p>
									<div className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
										<p>Sci-Fi (67%)</p>
									</div>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Favorite Decade</p>
									<div className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-cyan-600 mr-2"></div>
										<p>2010s (56%)</p>
									</div>
								</div>
								<div>
									<p className="text-sm text-gray-600 mb-1">Total Watch Time</p>
									<div className="flex items-center">
										<div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
										<p>18 hours</p>
									</div>
								</div>
							</div>
						</Card>
					</div>

					{/* Movie Lists */}
					<div className="flex-grow">
						<Tabs defaultValue="watchlist" className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6">
								<TabsTrigger
									value="watchlist"
									className="data-[state=active]:bg-white flex items-center"
									onClick={() => setActiveTab("watchlist")}
								>
									<Clock className="mr-2 h-4 w-4" /> Watchlist
								</TabsTrigger>
								<TabsTrigger
									value="liked"
									className="data-[state=active]:bg-white flex items-center"
									onClick={() => setActiveTab("liked")}
								>
									<Heart className="mr-2 h-4 w-4" /> Liked
								</TabsTrigger>
							</TabsList>

							<TabsContent value="watchlist">
								<h2 className="text-2xl font-bold mb-6">Your Watchlist</h2>
								{isLoadingWatchlist ? (
									<div className="text-center py-12">
										<p>Loading your watchlist...</p>
									</div>
								) : watchlistError || watchlistMovies.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-600">{watchlistError || "Your watchlist is empty."}</p>
										<Button
											asChild
											className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
										>
											<Link href="/movies">Find Movies to Watch</Link>
										</Button>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{watchlistMovies.map((movie) => (
											<MovieCard
												key={movie.id}
												movie={{
													id: movie.id,
													title: movie.title,
													year: movie.year,
													poster: movie.posterBase64 || "/placeholder.svg?height=450&width=300",
													genres: movie.genres || []
												}}
											/>
										))}
									</div>
								)}
							</TabsContent>

							<TabsContent value="liked">
								<h2 className="text-2xl font-bold mb-6">Movies You Liked</h2>
								{isLoadingLiked ? (
									<div className="text-center py-12">
										<p>Loading your liked movies...</p>
									</div>
								) : likedError || likedMovies.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-600">{likedError || "You haven't liked any movies yet."}</p>
										<Button
											asChild
											className="mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
										>
											<Link href="/movies">Discover Movies</Link>
										</Button>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{likedMovies.map((movie) => (
											<MovieCard
												key={movie.id}
												movie={{
													id: movie.id,
													title: movie.title,
													year: movie.year,
													poster: movie.posterBase64 || "/placeholder.svg?height=450&width=300",
													genres: movie.genres || []
												}}
											/>
										))}
									</div>
								)}
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	);
}

// Exports
export { ProfilePage as default };
