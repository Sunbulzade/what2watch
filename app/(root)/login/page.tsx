'use client';

// Imports - Node
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

// Imports - Local
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

function LoginPage() {
	const router = useRouter();
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/profile";
	
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
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

		try {
			const res = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			});

			if (res?.error) {
				toast({
					title: "Login Failed",
					description: "Invalid credentials. Please try again.",
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "Login Successful",
				description: "You have been logged in successfully.",
			});

			router.push(callbackUrl);
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast({
				title: "Login Failed",
				description: "An unexpected error occurred. Please try again.",
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
					<CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome back</CardTitle>
					<CardDescription className="text-center text-gray-600">
						Enter your credentials to access your account
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="space-y-4">
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
							/>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 bg-transparent" />
								<label htmlFor="remember" className="text-sm text-gray-600">
									Remember me
								</label>
							</div>
							<Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
								Forgot password?
							</Link>
						</div>
						<Button 
							type="submit" 
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
						>
							{isLoading ? "Logging in..." : "Login"}
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
						Don't have an account?{" "}
						<Link href="/signup" className="text-purple-600 hover:text-purple-700">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}

// Exports
export { LoginPage as default };
