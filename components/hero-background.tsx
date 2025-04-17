"use client";

// Imports - Node
import { useEffect, useRef } from "react";

export default function HeroBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas dimensions
		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Neural network nodes
		class Node {
			x: number;
			y: number;
			radius: number;
			vx: number;
			vy: number;
			connections: Node[];

			constructor(x: number, y: number, radius: number) {
				this.x = x;
				this.y = y;
				this.radius = radius;
				this.vx = (Math.random() - 0.5) * 0.3;
				this.vy = (Math.random() - 0.5) * 0.3;
				this.connections = [];
			}

			update(width: number, height: number) {
				this.x += this.vx;
				this.y += this.vy;

				// Bounce off edges
				if (this.x < this.radius || this.x > width - this.radius) {
					this.vx *= -1;
				}
				if (this.y < this.radius || this.y > height - this.radius) {
					this.vy *= -1;
				}
			}

			draw(ctx: CanvasRenderingContext2D) {
				// Draw node
				const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
				gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)"); // Purple
				gradient.addColorStop(1, "rgba(34, 211, 238, 0)"); // Cyan

				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
				ctx.fillStyle = gradient;
				ctx.fill();

				// Draw connections
				this.connections.forEach((node) => {
					const distance = Math.sqrt(Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2));

					if (distance < 200) {
						ctx.beginPath();
						ctx.moveTo(this.x, this.y);
						ctx.lineTo(node.x, node.y);

						const opacity = 1 - distance / 200;
						ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
						ctx.lineWidth = 1;
						ctx.stroke();
					}
				});
			}
		}

		// Create nodes
		const nodeCount = Math.floor(window.innerWidth / 100);
		const nodes: Node[] = [];

		for (let i = 0; i < nodeCount; i++) {
			const x = Math.random() * canvas.width;
			const y = Math.random() * canvas.height;
			const radius = Math.random() * 2 + 1;
			nodes.push(new Node(x, y, radius));
		}

		// Connect nodes
		nodes.forEach((node) => {
			nodes.forEach((otherNode) => {
				if (node !== otherNode) {
					node.connections.push(otherNode);
				}
			});
		});

		// Animation loop
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Update and draw nodes
			nodes.forEach((node) => {
				node.update(canvas.width, canvas.height);
				node.draw(ctx);
			});

			requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-white opacity-70" />;
}
