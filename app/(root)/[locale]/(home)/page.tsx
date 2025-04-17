// Imports - Node
import { ArrowRight, Film, Heart, Search } from "lucide-react";

// Imports - Local
import HowItWorks from "@/components/how-it-works";
import FeatureCard from "@/components/feature-card";
import HeroBackground from "@/components/hero-background";
import { Link } from "@/lib/i18n/routing";
import { Button } from "@/components/ui/button";

const testimonials = [
	{
		name: "Alex Johnson",
		title: "Film Enthusiast",
		quote: "MovieMind AI has completely changed how I discover films. The recommendations are spot on!",
	},
	{
		name: "Sarah Chen",
		title: "Casual Viewer",
		quote: "I was tired of scrolling through streaming services. This app saves me so much time finding great movies.",
	},
	{
		name: "Michael Rodriguez",
		title: "Film Student",
		quote: "The AI insights are incredible. I've discovered hidden gems I would have never found otherwise.",
	},
];

function HomePage() {
	return (
		<div className="min-h-screen bg-white text-gray-900">
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				<HeroBackground />
				<div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
					<h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 animate-gradient">
						Discover Your Next Favorite Movie with AI Precision
					</h1>
					<p className="text-lg md:text-xl max-w-3xl text-gray-700">
						Our AI-powered recommendation engine analyzes your preferences to find movies you'll love. No more endless
						scrolling, just perfect matches.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 mt-8">
						<Button
							asChild
							size="lg"
							className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
						>
							<Link href="/signup">
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-100">
							<Link href="/login">Login</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="flex justify-center py-20 bg-gradient-to-b from-white to-gray-100">
				<div className="container px-4 md:px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
							Key Features
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<FeatureCard
							icon={<Search className="h-10 w-10 text-purple-600" />}
							title="AI-Powered Recommendations"
							description="Our advanced AI analyzes your preferences and viewing history to suggest movies you'll truly enjoy."
						/>
						<FeatureCard
							icon={<Heart className="h-10 w-10 text-cyan-600" />}
							title="Manage Your Watchlist"
							description="Keep track of movies you want to watch, have watched, and your favorites in one organized place."
						/>
						<FeatureCard
							icon={<Film className="h-10 w-10 text-purple-600" />}
							title="Explore Movie Details"
							description="Dive deep into comprehensive information about any film, from cast details to AI-generated insights."
						/>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="flex justify-center py-20 bg-gray-100">
				<div className="container px-4 md:px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
							How It Works
						</span>
					</h2>
					<HowItWorks />
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="flex justify-center py-20 bg-white">
				<div className="container px-4 md:px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
							What Users Say
						</span>
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{testimonials.map((testimonial, index) => (
							<div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
								<div className="flex items-center mb-4">
									<div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center text-white font-bold">
										{testimonial.name.charAt(0)}
									</div>
									<div className="ml-4">
										<h4 className="font-semibold">{testimonial.name}</h4>
										<p className="text-sm text-gray-600">{testimonial.title}</p>
									</div>
								</div>
								<p className="text-gray-700">{testimonial.quote}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="flex justify-center py-12 bg-gray-100 border-t border-gray-200">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-6 md:mb-0">
							<h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
								MovieMind AI
							</h3>
							<p className="text-gray-600 mt-2">Your personal AI movie curator</p>
						</div>
						<div className="flex flex-wrap gap-8">
							<Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
								About Us
							</Link>
							<Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
								Contact
							</Link>
							<Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
								Privacy Policy
							</Link>
							<Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
								Terms of Service
							</Link>
						</div>
					</div>
					<div className="mt-8 text-center text-gray-600 text-sm">
						© {new Date().getFullYear()} MovieMind AI. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

// Exports
export { HomePage as default };
