"use client";

// Imports - Node
import Error from "next/error";
import { useEffect } from "react";

type Props = {
	error: Error & { digest?: string; };
	reset: () => void;
};

function RootError({ error }: Props): React.ReactNode {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<html lang="en">
			<body>
				<Error statusCode={500} />
			</body>
		</html>
	);
}

// Exports
export default RootError;
