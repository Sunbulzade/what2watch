import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define types for our movie poster data
type MoviePosterRaw = {
  id: number;
  id_tmdb: number;
  title: string;
  year: number;
  plot?: string;
  poster_jpeg?: Buffer;
  runtime?: number;
  genres?: any;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const genres = searchParams.get("genres") || "";
    const minYear = searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!, 10) : null;
    const maxYear = searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!, 10) : null;
    
    // Use a raw query to access the movie_posters table since it's not in the Prisma schema
    let movies: MoviePosterRaw[];
    
    if (query || genres || minYear || maxYear) {
      // Search for movies in movie_posters table matching the query or genres
      let sqlQuery = `
        SELECT 
          row_idx as id, 
          id_tmdb, 
          title, 
          EXTRACT(YEAR FROM release_date)::integer as year,
          overview as plot,
          poster_jpeg,
          runtime_min as runtime,
          genres
        FROM movie_posters
        WHERE 1=1
      `;
      
      const params: any[] = [];
      
      if (query) {
        sqlQuery += ` AND title ILIKE $${params.length + 1}`;
        params.push(`%${query}%`);
      }
      
      if (genres) {
        // The genres in the database are stored as JSON array with objects that have a 'name' property
        // We need to use a JSON containment check to find movies with specific genres
        sqlQuery += ` AND genres::jsonb @> $${params.length + 1}::jsonb`;
        
        // Split the comma-separated genres and create a JSON array of objects with name property
        const genresArray = genres.split(',').map(g => ({ name: g.trim() }));
        params.push(JSON.stringify(genresArray));
      }
      
      // Add year range filters if provided
      if (minYear !== null) {
        sqlQuery += ` AND EXTRACT(YEAR FROM release_date)::integer >= $${params.length + 1}`;
        params.push(minYear);
      }
      
      if (maxYear !== null) {
        sqlQuery += ` AND EXTRACT(YEAR FROM release_date)::integer <= $${params.length + 1}`;
        params.push(maxYear);
      }
      
      sqlQuery += ` LIMIT $${params.length + 1}`;
      params.push(limit);
      
      movies = await prisma.$queryRawUnsafe(sqlQuery, ...params);
    } else {
      // Get top movies based on popularity
      movies = await prisma.$queryRaw<MoviePosterRaw[]>`
        SELECT 
          row_idx as id, 
          id_tmdb, 
          title, 
          EXTRACT(YEAR FROM release_date)::integer as year,
          overview as plot,
          poster_jpeg,
          runtime_min as runtime,
          genres
        FROM movie_posters
        ORDER BY RANDOM()
        LIMIT ${limit}
      `;
    }
    
    // Process the binary poster data to base64 for each movie
    const processedMovies = movies.map((movie: any) => {
      // Convert binary poster data to base64 string
      let posterBase64 = null;
      if (movie.poster_jpeg) {
        const buffer = Buffer.from(movie.poster_jpeg);
        posterBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
      
      // Parse the genres JSON
      let genresArray: string[] = [];
      try {
        if (movie.genres) {
          // First, check if genres is already an object
          if (typeof movie.genres === 'object' && movie.genres !== null) {
            // If it's already an object, use it directly
            const genresObj = movie.genres;
            if (Array.isArray(genresObj)) {
              genresArray = genresObj.map((g: any) => g.name || "Unknown");
            } else {
              // If it's a single object, add it to the array
              genresArray = ["Unknown"];
            }
          } else if (typeof movie.genres === 'string') {
            // If it's a string, parse it
            const parsedGenres = JSON.parse(movie.genres);
            genresArray = parsedGenres.map((g: any) => g.name || "Unknown");
          }
        }
      } catch (e) {
        console.error("Error parsing genres:", e);
        // Provide default genres
        genresArray = ["Drama"];
      }
      
      return {
        ...movie,
        posterBase64,
        genres: genresArray
      };
    });
    
    return NextResponse.json({ 
      movies: processedMovies,
      success: true 
    });
  } catch (error) {
    console.error("Error fetching movies from movie_posters:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies", success: false },
      { status: 500 }
    );
  }
}
