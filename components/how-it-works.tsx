// Imports - Node
import { MessageSquare, ThumbsUp, Film } from "lucide-react";

export default function HowItWorks() {
	const steps = [
		{
			icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
			title: "Tell us what you like",
			description: "Share your movie preferences, favorite genres, and films you've enjoyed in the past.",
		},
		{
			icon: <ThumbsUp className="h-8 w-8 text-cyan-600" />,
			title: "Get AI recommendations",
			description: "Our AI analyzes your preferences and suggests movies tailored specifically to your taste.",
		},
		{
			icon: <Film className="h-8 w-8 text-purple-600" />,
			title: "Build your watchlist",
			description: "Save recommendations to your watchlist and keep track of movies you want to watch.",
		},
	];

	return (
		<div className="flex flex-col md:flex-row justify-between items-center gap-8">
			{steps.map((step, index) => (
				<div key={index} className="flex flex-col items-center text-center max-w-xs">
					<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">{step.icon}</div>
					<div className="relative mb-8 md:mb-0 md:pb-8">
						<h3 className="text-xl font-semibold mb-2">{step.title}</h3>
						<p className="text-gray-700">{step.description}</p>
					</div>
				</div>
			))}
		</div>
	);
}
