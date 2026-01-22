import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { books } from "../../../shared/schema";

export async function GET() {
  try {
    const allBooks = await db.select().from(books);
    
    if (allBooks.length === 0) {
      const sampleBooks = [
        {
          id: "1",
          title: "Pride and Prejudice",
          author: "Jane Austen",
          narrator: "Karen Savage",
          description: "A romantic novel following the emotional development of Elizabeth Bennet.",
          duration: 43200,
          coverImage: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
          audioUrl: "https://archive.org/download/pride_and_prejudice_0711_librivox/prideandprejudice_01_austen_64kb.mp3",
          genre: "Romance",
          publishedYear: 1813,
          source: "librivox",
          sourceId: "pride-prejudice",
          totalTime: "12:00:00",
          language: "English"
        },
        {
          id: "2",
          title: "The Adventures of Sherlock Holmes",
          author: "Arthur Conan Doyle",
          narrator: "Mark Smith",
          description: "A collection of twelve short stories featuring the famous detective Sherlock Holmes.",
          duration: 36000,
          coverImage: "https://covers.openlibrary.org/b/id/12645114-L.jpg",
          audioUrl: "https://archive.org/download/adventures_holmes_0711_librivox/adventuresofsherlockholmes_01_doyle_64kb.mp3",
          genre: "Mystery",
          publishedYear: 1892,
          source: "librivox",
          sourceId: "sherlock-adventures",
          totalTime: "10:00:00",
          language: "English"
        },
        {
          id: "3",
          title: "Frankenstein",
          author: "Mary Shelley",
          narrator: "Various",
          description: "A gothic science fiction novel about a scientist who creates a sapient creature.",
          duration: 28800,
          coverImage: "https://covers.openlibrary.org/b/id/6788810-L.jpg",
          audioUrl: "https://archive.org/download/frankenstein_0711_librivox/frankenstein_01_shelley_64kb.mp3",
          genre: "Horror",
          publishedYear: 1818,
          source: "librivox",
          sourceId: "frankenstein",
          totalTime: "8:00:00",
          language: "English"
        }
      ];
      
      return NextResponse.json(sampleBooks);
    }
    
    return NextResponse.json(allBooks);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}
