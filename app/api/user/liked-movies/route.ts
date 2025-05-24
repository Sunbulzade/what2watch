import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to view liked movies",
        success: false 
      }, { status: 401 });
    }

    // Get the user with their liked movies
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        likedMovies: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        error: "User not found",
        success: false 
      }, { status: 404 });
    }

    // Get the poster data for each liked movie
    const likedMoviesWithPosters = await Promise.all(
      user.likedMovies.map(async (movie) => {
        // Try to find the poster in the movie_posters table
        const moviePoster = await prisma.$queryRaw<any[]>`
          SELECT 
            row_idx as id, 
            poster_jpeg,
            genres
          FROM movie_posters
          WHERE row_idx = ${parseInt(movie.id, 10)}
          LIMIT 1
        `;

        let posterBase64 = null;
        if (moviePoster && moviePoster.length > 0 && moviePoster[0].poster_jpeg) {
          const buffer = Buffer.from(moviePoster[0].poster_jpeg);
          posterBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
        }

        return {
          ...movie,
          posterBase64
        };
      })
    );

    // Return the liked movies with their posters
    return NextResponse.json({ 
      likedMovies: likedMoviesWithPosters,
      success: true 
    });
  } catch (error) {
    console.error("Error fetching liked movies:", error);
    return NextResponse.json({ 
      error: "Failed to fetch liked movies",
      success: false 
    }, { status: 500 });
  }
}