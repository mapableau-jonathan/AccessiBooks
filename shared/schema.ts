import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const books = pgTable("books", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  author: text("author").notNull(),
  narrator: text("narrator"),
  description: text("description"),
  duration: integer("duration").notNull(), // duration in seconds
  coverImage: text("cover_image"),
  audioUrl: text("audio_url").notNull(),
  genre: text("genre"),
  publishedYear: integer("published_year"),
  source: text("source").notNull().default("local"), // Track which API/source this book came from
  sourceId: text("source_id"), // Original ID from the source API
  totalTime: text("total_time"), // Human readable duration (e.g., "11:35:00")
  language: text("language").default("English"),
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
});

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Subscription tier enum values
export const SUBSCRIPTION_TIERS = ["free", "premium"] as const;
export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[number];

// User table for multi-provider authentication (matches existing database)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  authProvider: varchar("auth_provider").default("local"),
  providerId: varchar("provider_id"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Legacy columns from NextAuth migration - kept for database compatibility
  passwordHash: varchar("password_hash"),
  name: varchar("name"),
  emailVerified: timestamp("email_verified"),
  image: varchar("image"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Listening history table for tracking user activity
export const listeningHistory = pgTable("listening_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: varchar("book_id").notNull(),
  bookTitle: text("book_title").notNull(),
  bookAuthor: text("book_author"),
  bookCover: text("book_cover"),
  currentTime: integer("current_time").notNull().default(0), // Progress in seconds
  totalDuration: integer("total_duration"), // Book duration in seconds
  lastPlayedAt: timestamp("last_played_at").defaultNow(),
  completedAt: timestamp("completed_at"), // When user finished the book
  playCount: integer("play_count").notNull().default(1),
}, (table) => [
  index("idx_listening_history_user").on(table.userId),
  index("idx_listening_history_last_played").on(table.lastPlayedAt),
]);

export const insertListeningHistorySchema = createInsertSchema(listeningHistory).omit({
  id: true,
  lastPlayedAt: true,
});

export type InsertListeningHistory = z.infer<typeof insertListeningHistorySchema>;
export type ListeningHistory = typeof listeningHistory.$inferSelect;

// Bookmark type for frontend use
export interface Bookmark {
  id: string;
  bookId: string;
  name: string;
  time: number; // time in seconds
  createdAt: string;
}

// Progress tracking type
export interface Progress {
  bookId: string;
  currentTime: number;
  lastPlayed: string;
}

// User reviews for books
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: varchar("book_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_reviews_user").on(table.userId),
  index("idx_reviews_book").on(table.bookId),
  index("idx_reviews_created").on(table.createdAt),
]);

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Review likes/helpful votes
export const reviewLikes = pgTable("review_likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  reviewId: varchar("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_review_likes_user").on(table.userId),
  index("idx_review_likes_review").on(table.reviewId),
]);

export const insertReviewLikeSchema = createInsertSchema(reviewLikes).omit({
  id: true,
  createdAt: true,
});

export type InsertReviewLike = z.infer<typeof insertReviewLikeSchema>;
export type ReviewLike = typeof reviewLikes.$inferSelect;

// User follows for social features
export const userFollows = pgTable("user_follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  followerId: varchar("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: varchar("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_user_follows_follower").on(table.followerId),
  index("idx_user_follows_following").on(table.followingId),
]);

export const insertUserFollowSchema = createInsertSchema(userFollows).omit({
  id: true,
  createdAt: true,
});

export type InsertUserFollow = z.infer<typeof insertUserFollowSchema>;
export type UserFollow = typeof userFollows.$inferSelect;

// External ratings cache
export const externalRatings = pgTable("external_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookId: varchar("book_id").notNull(),
  source: varchar("source").notNull(), // google-books, itunes, open-library
  rating: integer("rating"), // Normalized to 0-100 scale
  reviewCount: integer("review_count"),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
  index("idx_external_ratings_book").on(table.bookId),
]);

export type ExternalRating = typeof externalRatings.$inferSelect;

// Author metadata cache
export const authors = pgTable("authors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  bio: text("bio"),
  birthDate: varchar("birth_date"),
  deathDate: varchar("death_date"),
  photoUrl: text("photo_url"),
  openLibraryKey: varchar("open_library_key"),
  wikipedia: text("wikipedia"),
  lastUpdated: timestamp("last_updated").defaultNow(),
}, (table) => [
  index("idx_authors_name").on(table.name),
  index("idx_authors_ol_key").on(table.openLibraryKey),
]);

export type Author = typeof authors.$inferSelect;

// Review with user info for display
export interface ReviewWithUser extends Review {
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImageUrl: string | null;
  };
  likesCount: number;
  isLiked?: boolean;
}

// Aggregated ratings from multiple sources
export interface AggregatedRatings {
  averageRating: number; // 0-5 scale
  totalReviews: number;
  userRating?: number;
  sources: {
    name: string;
    rating: number;
    reviewCount: number;
  }[];
}
