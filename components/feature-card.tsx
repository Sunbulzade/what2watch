interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="bg-white bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
			<div className="mb-4">{icon}</div>
			<h3 className="text-xl font-semibold mb-2">{title}</h3>
			<p className="text-gray-700">{description}</p>
		</div>
	);
}
