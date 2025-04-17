// Imports - Node
import Link from "next/link";

// Imports - Local
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function LoginPage() {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-white to-cyan-100" />
			</div>

			<Card className="w-full max-w-md bg-white border-gray-200">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
					<CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="john@example.com" className="bg-white border-gray-300" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" className="bg-white border-gray-300" />
					</div>
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 bg-white" />
							<label htmlFor="remember" className="text-sm text-gray-600">
								Remember me
							</label>
						</div>
						<Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
							Forgot password?
						</Link>
					</div>
					<Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
						Login
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
						<Button variant="outline" className="border-gray-300 hover:bg-gray-100">
							Google
						</Button>
						<Button variant="outline" className="border-gray-300 hover:bg-gray-100">
							Facebook
						</Button>
					</div>
				</CardContent>
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
