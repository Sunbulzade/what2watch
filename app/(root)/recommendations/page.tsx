"use client";

// Imports - Node
import { useState, useRef, useEffect } from "react";
import { Search, Plus, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSession } from "next-auth/react";

// Imports - Local
import MovieCard from "@/components/movie-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

type MovieWithReason = Movie & {
	reason?: string;
};

type Message = {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: Date;
};

function RecommendationsPage() {
	const { data: session } = useSession();
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [recommendations, setRecommendations] = useState<MoviePoster[]>([]);
	const [dbMovies, setDbMovies] = useState<MoviePoster[]>([]);
	const [chatMessage, setChatMessage] = useState("");
	const [chatHistory, setChatHistory] = useState<Message[]>([{
		id: "welcome-message",
		content:
			"Merhaba! Ben sizin film öneri asistanınızım. Sevdiğiniz filmler, izlemek istediğiniz türler veya aradığınız tarzda film önerileri hakkında bana bilgi verebilirsiniz. Size özel film önerileri sunmaktan memnuniyet duyarım!",
		role: "assistant",
		timestamp: new Date(),
	},
	]);
	const [isChatLoading, setIsChatLoading] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [movies, setMovies] = useState<MoviePoster[]>([]);
	const [error, setError] = useState<string | null>(null);


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


	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
			if (scrollContainer) {
				scrollContainer.scrollTop = scrollContainer.scrollHeight;
			}
		}
	}, [chatHistory, isChatLoading]);

	// Load initial movies from database on page load
	useEffect(() => {
		const fetchInitialMovies = async () => {
			try {
				const response = await fetch("/api/movie-posters?limit=10");
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.movies.length > 0) {
						setDbMovies(data.movies);
					}
				}
			} catch (error) {
				console.error("Error fetching initial movies:", error);
			}
		};

		fetchInitialMovies();
	}, []);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setIsLoading(true);
		try {
			// First try to fetch from our database based on search query
			// Using searchType=title to focus on movie titles
			const dbResponse = await fetch(`/api/movie-posters?query=${encodeURIComponent(searchQuery)}`);
			const dbData = await dbResponse.json();
			console.log("Database response:", dbData);

			if (dbData.success && dbData.movies.length > 0) {
				// If we have database results, use them
				const moviesWithReasons = dbData.movies.map((movie: Movie) => ({
					...movie,
					// Add generic reason if none exists
					reason: `Movie title matches "${searchQuery}"`
				}));
				setRecommendations(moviesWithReasons);
			} else {
				// If no database results, fall back to AI recommendations
			}
		} catch (error) {
			console.error("Error getting recommendations:", error);
			// Use fallback for AI recommendations if they fail
		} finally {
			setIsLoading(false);
		}
	};
	const handleChatSubmit = async () => {
		if (!chatMessage.trim()) return;

		// Add user message to chat history
		const userMessage: Message = {
			id: Date.now().toString(),
			content: chatMessage,
			role: "user",
			timestamp: new Date(),
		};

		setChatHistory((prev) => [...prev, userMessage]);
		const currentMessage = chatMessage;
		setChatMessage("");
		setIsChatLoading(true);

		try {
			// Film RAG sistemine özel olarak yapılandırılmış prompt
			const systemPrompt = "You are a movie expert. You can only talk about films, directors, actors, film genres, movie recommendations, and general cinema knowledge. You must not respond to questions unrelated to these topics. Try to help users as much as possible and offer personalized recommendations based on the user's movie preferences. Please respond only in English.";

			const response = await fetch("http://localhost:11434/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "llama3:latest",
					prompt: `${systemPrompt}\n\nKullanıcı: ${currentMessage}`,
					stream: false,
				}),
			});

			if (!response.ok) {
				throw new Error("Model yanıt vermedi");
			}

			const data = await response.json();

			const assistantMessage: Message = {
				id: Date.now().toString(),
				content: data.response || "Üzgünüm, film önerisi oluşturamadım. Lütfen tekrar deneyin.",
				role: "assistant",
				timestamp: new Date(),
			};

			setChatHistory((prev) => [...prev, assistantMessage]);

			// Eğer film önerisi içeriyorsa, arama sonuçlarını da göster
			if (currentMessage.toLowerCase().includes("film") ||
				currentMessage.toLowerCase().includes("movie") ||
				currentMessage.toLowerCase().includes("öneri") ||
				currentMessage.toLowerCase().includes("recommend")) {
				setSearchQuery(currentMessage);
				// Search by title when the message mentions a specific movie title
				const movieTitleMention = currentMessage.toLowerCase().includes("film") ||
					currentMessage.toLowerCase().includes("movie");
				handleSearch();
			}
		} catch (error) {
			console.error("Chat yanıtı alınırken hata:", error);

			const errorMessage: Message = {
				id: Date.now().toString(),
				content: "Üzgünüm, bir hata oluştu. Ollama modelinizin çalıştığından emin olun.",
				role: "assistant",
				timestamp: new Date(),
			};

			setChatHistory((prev) => [...prev, errorMessage]);
		} finally {
			setIsChatLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex justify-center bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
					Movie Recommendations
				</h1>

				<Tabs defaultValue="search" className="w-full">
					<TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
						<TabsTrigger value="search" className="data-[state=active]:bg-white">
							Search
						</TabsTrigger>
						<TabsTrigger value="chat" className="data-[state=active]:bg-white">
							Chat
						</TabsTrigger>
						<TabsTrigger value="guided" className="data-[state=active]:bg-white">
							Guided
						</TabsTrigger>
					</TabsList>

					<TabsContent value="search" className="mt-6">
						<div className="flex gap-2 mb-8">
							<Input
								placeholder="Enter a movie title to search..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-white border-gray-300"
							/>
							<Button
								onClick={handleSearch}
								className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
							>
								{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
								Search Movies
							</Button>
						</div>
					</TabsContent>

					<TabsContent value="chat" className="mt-6">
						<Card className="bg-white border-gray-200">
							<CardContent className="p-6">
								<ScrollArea ref={scrollAreaRef} className="h-[400px] pr-4 mb-4">
									<div className="space-y-4">
										{chatHistory.map((message) => (
											<div
												key={message.id}
												className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"
														}`}
												>
													<Avatar className="h-8 w-8 bg-gradient-to-r from-purple-600 to-cyan-600">
														<div className="text-white text-xs font-bold">
															{message.role === "user" ? "ME" : "AI"}
														</div>
													</Avatar>
													<div
														className={`rounded-lg px-4 py-2 text-sm ${message.role === "user"
															? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white"
															: "bg-gray-100 text-gray-800"
															}`}
													>
														{message.role === "assistant" ? (
															<div className="markdown-wrapper">
																<style jsx>{`
																	.markdown-wrapper :global(p) {
																		margin-bottom: 0.75rem;
																	}
																	.markdown-wrapper :global(p:last-child) {
																		margin-bottom: 0;
																	}
																	.markdown-wrapper :global(strong) {
																		font-weight: 700;
																	}
																	.markdown-wrapper :global(em) {
																		font-style: italic;
																	}
																	.markdown-wrapper :global(h1) {
																		font-size: 1.25rem;
																		font-weight: 700;
																		margin-top: 1rem;
																		margin-bottom: 0.5rem;
																	}
																	.markdown-wrapper :global(h2) {
																		font-size: 1.15rem;
																		font-weight: 600;
																		margin-top: 0.75rem;
																		margin-bottom: 0.5rem;
																	}
																	.markdown-wrapper :global(h3, h4, h5, h6) {
																		font-size: 1rem;
																		font-weight: 600;
																		margin-top: 0.5rem;
																		margin-bottom: 0.25rem;
																	}
																	.markdown-wrapper :global(ul, ol) {
																		margin: 0.5rem 0;
																		padding-left: 1.5rem;
																	}
																	.markdown-wrapper :global(ul) {
																		list-style-type: disc;
																	}
																	.markdown-wrapper :global(ol) {
																		list-style-type: decimal;
																	}
																	.markdown-wrapper :global(li) {
																		margin-bottom: 0.25rem;
																	}
																	.markdown-wrapper :global(a) {
																		color: #6366f1;
																		text-decoration: underline;
																	}
																	.markdown-wrapper :global(code) {
																		font-family: monospace;
																		background-color: rgba(0, 0, 0, 0.05);
																		padding: 0.125rem 0.25rem;
																		border-radius: 0.25rem;
																	}
																	.markdown-wrapper :global(blockquote) {
																		border-left: 3px solid #9333ea;
																		padding-left: 0.75rem;
																		font-style: italic;
																		margin: 0.5rem 0;
																	}
																`}</style>
																<ReactMarkdown
																	remarkPlugins={[remarkGfm]}
																>
																	{message.content}
																</ReactMarkdown>
															</div>
														) : (
															message.content
														)}
													</div>
												</div>
											</div>
										))}
										{isChatLoading && (
											<div className="flex justify-start">
												<div className="flex gap-3">
													<Avatar className="h-8 w-8 bg-gradient-to-r from-purple-600 to-cyan-600">
														<div className="text-white text-xs font-bold">AI</div>
													</Avatar>
													<div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
														<Loader2 className="h-4 w-4 animate-spin" />
													</div>
												</div>
											</div>
										)}
									</div>
								</ScrollArea>
								<div className="flex flex-col gap-2">
									<div className="relative">
										<Textarea
											placeholder="Ask about movies or describe what you're looking for..."
											className="resize-none min-h-[80px] bg-white border-gray-300 pr-12"
											value={chatMessage}
											onChange={(e) => setChatMessage(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													handleChatSubmit();
												}
											}}
										/>
										<Button
											onClick={handleChatSubmit}
											className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 h-8 w-8 p-0 rounded-full"
											disabled={isChatLoading || !chatMessage.trim()}
										>
											{isChatLoading ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Send className="h-4 w-4" />
											)}
										</Button>
									</div>
									<p className="text-xs text-gray-500 italic">
										Press Enter to send, Shift+Enter for a new line. The AI will respond with suggestions for movies based on your interests.
									</p>
								</div>
							</CardContent>
						</Card>
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
													onClick={() => {
														setSearchQuery(genre);
														handleSearch();
													}}
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

									<Button
										className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
										onClick={handleSearch}
									>
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
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{movies.length > 0 ? (
								movies.map((movie) => (
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
								))
							) : (
								// Fallback data if database is empty
								[
									{
										id: "1",
										title: "Inception",
										year: 2010,
										poster: "/inception.jpg",
										genres: ["Sci-Fi", "Action", "Thriller"],
										reason: "Mind-bending sci-fi with complex narrative structure"
									},
									{
										id: "2",
										title: "The Matrix",
										year: 1999,
										poster: "/matrix.webp",
										genres: ["Sci-Fi", "Action"],
										reason: "Revolutionary sci-fi with philosophical themes"
									},
									{
										id: "3",
										title: "Interstellar",
										year: 2014,
										poster: "/interstellar.jpg",
										genres: ["Sci-Fi", "Drama", "Adventure"],
										reason: "Epic space journey with emotional depth"
									}
								].map((movie) => (
									<MovieCard key={movie.id} movie={movie} />
								))
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Exports
export { RecommendationsPage as default };
