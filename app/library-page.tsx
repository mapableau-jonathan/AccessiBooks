"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Book } from "../shared/schema";
import { Input } from "../client/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../client/src/components/ui/select";
import { Search, Library as LibraryIcon, Play, Clock, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../client/src/components/ui/card";
import { Button } from "../client/src/components/ui/button";

export function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const { data: session } = useSession();
  const router = useRouter();

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  const handleSelectBook = (book: Book) => {
    router.push(`/player/${book.id}`);
  };

  const filteredAndSortedBooks = books
    .filter(book => {
      return book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "author":
          return a.author.localeCompare(b.author);
        case "duration":
          return a.duration - b.duration;
        case "recent":
          return (b.publishedYear || 0) - (a.publishedYear || 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Failed to load books. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <LibraryIcon className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold">Your Library</h1>
        </div>
        {session?.user?.name && (
          <p className="text-muted-foreground">
            Welcome back, {session.user.name}
          </p>
        )}
      </header>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search audiobooks"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Sort books by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
            <SelectItem value="recent">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted rounded-lg aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredAndSortedBooks.map((book) => (
            <Card 
              key={book.id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSelectBook(book)}
            >
              <div className="aspect-[3/4] relative bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900 dark:to-orange-900">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <LibraryIcon className="h-12 w-12 text-amber-600/50" />
                  </div>
                )}
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectBook(book);
                  }}
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {book.author}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(book.duration)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredAndSortedBooks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No books found matching your search.
        </div>
      )}
    </div>
  );
}
