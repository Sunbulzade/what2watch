import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const searchType = searchParams.get("searchType") || "all"; // Add searchType parameter
    
    let movies;
    
    if (query) {
      // Conditionally set the search criteria based on searchType
      let searchCondition: Prisma.MovieWhereInput;
      
      if (searchType === "title") {
        // Search only by title
        searchCondition = {
          title: { contains: query, mode: "insensitive" as Prisma.QueryMode }
        };
      } else {
        // Default search (all fields)
        searchCondition = {
          OR: [
            { title: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            { director: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            { genres: { has: query } }
          ]
        };
      }
      
      movies = await prisma.movie.findMany({
        where: searchCondition,
        take: limit,
        orderBy: { rating: "desc" }
      });
    } else {
      // Return top rated movies if no query
      movies = await prisma.movie.findMany({
        take: limit,
        orderBy: { rating: "desc" }
      });
    }
    
    return NextResponse.json({ 
      movies,
      success: true 
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies", success: false },
      { status: 500 }
    );
  }
}
