"use client";

// Imports - Node
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, User, Bell, Shield, Trash2 } from "lucide-react";

// Imports - Local
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function SettingsPage() {
	const [email, setEmail] = useState("john@example.com");
	const [username, setUsername] = useState("johndoe");

	return (
		<div className="min-h-screen bg-white text-gray-900">
			<div className="container px-4 py-8 pt-24">
				<div className="flex items-center mb-8">
					<Button asChild variant="ghost" className="mr-4 text-gray-700 hover:bg-gray-100">
						<Link href="/profile">
							<ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
						</Link>
					</Button>
					<h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600">
						Settings
					</h1>
				</div>

				<Tabs defaultValue="account" className="w-full">
					<div className="flex flex-col md:flex-row gap-8">
						<div className="w-full md:w-1/4">
							<TabsList className="flex flex-col h-auto bg-transparent space-y-1">
								<TabsTrigger
									value="account"
									className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 rounded-lg w-full"
								>
									<User className="mr-2 h-4 w-4" /> Account
								</TabsTrigger>
								<TabsTrigger
									value="notifications"
									className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 rounded-lg w-full"
								>
									<Bell className="mr-2 h-4 w-4" /> Notifications
								</TabsTrigger>
								<TabsTrigger
									value="privacy"
									className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 rounded-lg w-full"
								>
									<Shield className="mr-2 h-4 w-4" /> Privacy
								</TabsTrigger>
							</TabsList>
						</div>

						<div className="flex-grow">
							<TabsContent value="account">
								<Card className="bg-white border-gray-200">
									<CardHeader>
										<CardTitle>Account Settings</CardTitle>
										<CardDescription>Manage your account information and preferences</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-2">
											<Label htmlFor="username">Username</Label>
											<Input
												id="username"
												value={username}
												onChange={(e) => setUsername(e.target.value)}
												className="bg-white border-gray-300"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="email">Email</Label>
											<Input
												id="email"
												type="email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="bg-white border-gray-300"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="current-password">Current Password</Label>
											<Input
												id="current-password"
												type="password"
												placeholder="••••••••"
												className="bg-white border-gray-300"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="new-password">New Password</Label>
											<Input
												id="new-password"
												type="password"
												placeholder="••••••••"
												className="bg-white border-gray-300"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="confirm-password">Confirm New Password</Label>
											<Input
												id="confirm-password"
												type="password"
												placeholder="••••••••"
												className="bg-white border-gray-300"
											/>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline" className="border-gray-300 hover:bg-gray-100">
											Cancel
										</Button>
										<Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
											Save Changes
										</Button>
									</CardFooter>
								</Card>

								<Card className="bg-white border-gray-200 mt-6">
									<CardHeader>
										<CardTitle className="text-red-500">Danger Zone</CardTitle>
										<CardDescription>Permanently delete your account and all of your data</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-gray-700 mb-4">
											Once you delete your account, there is no going back. This action cannot be undone.
										</p>
										<Button variant="destructive" className="bg-red-600 hover:bg-red-700">
											<Trash2 className="mr-2 h-4 w-4" /> Delete Account
										</Button>
									</CardContent>
								</Card>
							</TabsContent>

							<TabsContent value="notifications">
								<Card className="bg-white border-gray-200">
									<CardHeader>
										<CardTitle>Notification Settings</CardTitle>
										<CardDescription>Manage how and when you receive notifications</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-medium">Email Notifications</h3>
											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="new-recommendations">New Recommendations</Label>
													<p className="text-sm text-gray-600">
														Receive emails when we have new movie recommendations for you
													</p>
												</div>
												<Switch id="new-recommendations" defaultChecked />
											</div>

											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="watchlist-reminders">Watchlist Reminders</Label>
													<p className="text-sm text-gray-600">Get reminded about movies in your watchlist</p>
												</div>
												<Switch id="watchlist-reminders" defaultChecked />
											</div>

											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="newsletter">Weekly Newsletter</Label>
													<p className="text-sm text-gray-600">
														Receive our weekly newsletter with movie news and updates
													</p>
												</div>
												<Switch id="newsletter" />
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-lg font-medium">Notification Frequency</h3>
											<Separator className="bg-gray-300" />

											<div className="space-y-2">
												<Label htmlFor="frequency">Email Frequency</Label>
												<select
													id="frequency"
													defaultValue="weekly"
													className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
												>
													<option value="daily">Daily</option>
													<option value="weekly">
														Weekly
													</option>
													<option value="monthly">Monthly</option>
												</select>
											</div>
										</div>
									</CardContent>
									<CardFooter>
										<Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
											Save Notification Preferences
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>

							<TabsContent value="privacy">
								<Card className="bg-white border-gray-200">
									<CardHeader>
										<CardTitle>Privacy Settings</CardTitle>
										<CardDescription>Manage your privacy and data preferences</CardDescription>
									</CardHeader>
									<CardContent className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-medium">Data Collection</h3>
											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="recommendation-data">Recommendation Data</Label>
													<p className="text-sm text-gray-600">
														Allow us to collect data about your preferences to improve recommendations
													</p>
												</div>
												<Switch id="recommendation-data" defaultChecked />
											</div>

											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="usage-analytics">Usage Analytics</Label>
													<p className="text-sm text-gray-600">
														Allow us to collect anonymous usage data to improve our service
													</p>
												</div>
												<Switch id="usage-analytics" defaultChecked />
											</div>

											<Separator className="bg-gray-300" />

											<div className="flex items-center justify-between">
												<div className="space-y-0.5">
													<Label htmlFor="third-party">Third-Party Data Sharing</Label>
													<p className="text-sm text-gray-600">
														Allow us to share anonymous data with trusted partners
													</p>
												</div>
												<Switch id="third-party" />
											</div>
										</div>

										<div className="space-y-2">
											<Button variant="outline" className="w-full border-gray-300 hover:bg-gray-100">
												Download My Data
											</Button>
										</div>
									</CardContent>
									<CardFooter>
										<Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
											Save Privacy Settings
										</Button>
									</CardFooter>
								</Card>
							</TabsContent>
						</div>
					</div>
				</Tabs>
			</div>
		</div>
	);
}


// Exports
export { SettingsPage as default };
