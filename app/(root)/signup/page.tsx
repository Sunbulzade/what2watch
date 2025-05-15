'use client';

// Imports - Node
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Imports - Local
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function SignupPage() {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		// Validate password match
		if (formData.password !== formData.confirmPassword) {
			toast({
				title: "Passwords do not match",
				description: "Please ensure both passwords match",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to register");
			}

			toast({
				title: "Registration Successful",
				description: "Your account has been created. Please log in.",
			});

			// Redirect to login page
			router.push("/login");
		} catch (error: any) {
			console.error("Registration error:", error);
			toast({
				title: "Registration Failed",
				description: error.message || "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="w-full max-w-md bg-white border-gray-200 shadow-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center text-gray-900">Create an account</CardTitle>
					<CardDescription className="text-center text-gray-600">
						Enter your details below to create your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name" className="text-gray-700">
								Full Name
							</Label>
							<Input 
								id="name" 
								name="name"
								placeholder="John Doe" 
								className="bg-white border-gray-300 text-gray-900" 
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-700">
								Email
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="john@example.com"
								className="bg-white border-gray-300 text-gray-900"
								value={formData.email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-700">
								Password
							</Label>
							<Input 
								id="password" 
								name="password"
								type="password" 
								className="bg-white border-gray-300 text-gray-900" 
								value={formData.password}
								onChange={handleChange}
								required
								minLength={6}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="confirmPassword" className="text-gray-700">
								Confirm Password
							</Label>
							<Input 
								id="confirmPassword" 
								name="confirmPassword"
								type="password" 
								className="bg-white border-gray-300 text-gray-900" 
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								minLength={6}
							/>
						</div>
						<Button 
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
						>
							{isLoading ? "Creating Account..." : "Sign Up"}
						</Button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-white px-2 text-gray-600">Or continue with</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Button type="button" variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
								Google
							</Button>
							<Button type="button" variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700">
								Facebook
							</Button>
						</div>
					</CardContent>
				</form>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link href="/login" className="text-purple-600 hover:text-purple-700">
							Login
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

// Exports
export { SignupPage as default };
