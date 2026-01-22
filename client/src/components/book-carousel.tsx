import { useRef } from "react";
import { Book } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, BookOpen } from "lucide-react";

interface BookCarouselProps {
  title: string;
  books: Book[];
  onBookSelect: (book: Book) => void;
  icon?: typeof BookOpen;
}

export function BookCarousel({ title, books, onBookSelect, icon: Icon = BookOpen }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (books.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-shrink-0 w-36 md:w-44 cursor-pointer group snap-start"
            onClick={() => onBookSelect(book)}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary rounded-full p-3 shadow-lg">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {book.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {book.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GenreCarouselProps {
  genres: { name: string; count: number; color: string }[];
  onGenreSelect: (genre: string) => void;
  selectedGenre?: string;
}

export function GenreCarousel({ genres, onGenreSelect, selectedGenre }: GenreCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Browse by Genre</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Button
          variant={!selectedGenre ? "default" : "outline"}
          onClick={() => onGenreSelect("")}
          className="flex-shrink-0"
        >
          All
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre.name}
            variant={selectedGenre === genre.name ? "default" : "outline"}
            onClick={() => onGenreSelect(genre.name)}
            className="flex-shrink-0 gap-2"
            style={{
              borderColor: selectedGenre !== genre.name ? genre.color : undefined,
            }}
          >
            {genre.name}
            <span className="text-xs opacity-70">({genre.count})</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
