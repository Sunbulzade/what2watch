import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ 
        error: "You must be logged in to add a movie to your watchlist",
        success: false 
      }, { status: 401 });
    }

    // Get the movie ID from the request body
    const data = await request.json();
    const { movieId } = data;

    if (!movieId) {
      return NextResponse.json({ 
        error: "Movie ID is required",
        success: false 
      }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ 
        error: "User not found",
        success: false 
      }, { status: 404 });
    }

    // Check if the movie exists in the Movie table
    let movie = await prisma.movie.findUnique({
      where: { id: movieId.toString() }
    });

    // If movie doesn't exist in the Movie table but exists in movie_posters table
    // We need to create it in the Movie table
    if (!movie) {
      try {
        // Try to fetch from movie_posters table
        const moviePoster = await prisma.$queryRaw<any[]>`
          SELECT 
            id_tmdb, 
            title, 
            EXTRACT(YEAR FROM release_date)::integer as year,
            overview as plot,
            genres
          FROM movie_posters
          WHERE row_idx = ${parseInt(movieId.toString(), 10)}
          LIMIT 1
        `;

        if (moviePoster && moviePoster.length > 0) {
          const posterData = moviePoster[0];
          
          // Parse genres
          let genresArray: string[] = [];
          try {
            if (posterData.genres) {
              if (typeof posterData.genres === 'object' && posterData.genres !== null) {
                const genresObj = posterData.genres;
                if (Array.isArray(genresObj)) {
                  genresArray = genresObj.map((g: any) => g.name || "Unknown");
                }
              } else if (typeof posterData.genres === 'string') {
                const parsedGenres = JSON.parse(posterData.genres);
                genresArray = parsedGenres.map((g: any) => g.name || "Unknown");
              }
            }
          } catch (e) {
            console.error("Error parsing genres:", e);
            genresArray = ["Drama"];
          }

          // Create the movie in the Movie table
          movie = await prisma.movie.create({
            data: {
              id: movieId.toString(),
              title: posterData.title,
              year: posterData.year,
              plot: posterData.plot || null,
              genres: genresArray,
              cast: []
            }
          });
        } else {
          return NextResponse.json({ 
            error: "Movie not found in database",
            success: false 
          }, { status: 404 });
        }
      } catch (error) {
        console.error("Error fetching/creating movie:", error);
        return NextResponse.json({ 
          error: "Failed to process movie data",
          success: false 
        }, { status: 500 });
      }
    }

    // Connect the user to the movie (add to watchlist)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        watchlist: {
          connect: { id: movie.id }
        }
      }
    });

    return NextResponse.json({ 
      message: "Movie added to watchlist successfully",
      success: true 
    });
  } catch (error) {
    console.error("Error adding movie to watchlist:", error);
    return NextResponse.json({ 
      error: "Failed to add movie to watchlist",
      success: false 
    }, { status: 500 });
  }
}
