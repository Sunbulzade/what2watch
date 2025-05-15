// Imports - Node
import Link from "next/link";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, Plus, Info } from "lucide-react";

// Imports - Local
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface MovieCardProps {
	movie: {
		id: string | number;
		title: string;
		year: number;
		poster: string;
		genres: string[];
		reason?: string;
	};
}

export default function MovieCard({ movie }: MovieCardProps) {
	return (
		<Card className="bg-white border-gray-200 overflow-hidden hover:border-purple-500 transition-all duration-300 flex flex-col">
			<div className="relative aspect-[2/3] overflow-hidden">
				<Image
					src={movie.poster || "/placeholder.svg"}
					alt={movie.title}
					fill
					className="object-cover transition-transform duration-300 hover:scale-105"
				/>
			</div>

			<CardContent className="p-4 flex-grow">
				<h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
				<div className="flex items-center justify-between mb-2">
					<span className="text-gray-600 text-sm">{movie.year}</span>
					<div className="flex gap-1">
						{movie.genres.slice(0, 2).map((genre) => (
							<Badge key={genre} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-800">
								{genre}
							</Badge>
						))}
					</div>
				</div>
				{movie.reason && (
					<p className="text-sm text-gray-700 line-clamp-2 mt-2">
						<span className="text-purple-600 font-medium">Why: </span>
						{movie.reason}
					</p>
				)}
			</CardContent>

			<CardFooter className="p-4 pt-0 grid grid-cols-4 gap-2">
				<Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100 hover:text-green-600">
					<ThumbsUp className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100 hover:text-red-600">
					<ThumbsDown className="h-4 w-4" />
				</Button>
				<Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100 hover:text-purple-600">
					<Plus className="h-4 w-4" />
				</Button>
				<Button asChild variant="outline" size="icon" className="border-gray-300 hover:bg-gray-100 hover:text-cyan-600">
					<Link href={`/movies/${movie.id}`}>
						<Info className="h-4 w-4" />
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
