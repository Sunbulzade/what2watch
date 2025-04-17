"use client";

// Imports - Node
import Error from "next/error";

function RootNotFound(): React.ReactNode {
	return (
		<html lang="en">
			<body>
				<Error statusCode={404} />
			</body>
		</html>
	);
}

// Exports
export default RootNotFound;
