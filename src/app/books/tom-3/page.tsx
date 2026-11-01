import type { Metadata } from "next";
import { BookDetail, bookMeta } from "@/components/book-detail";
import { BOOKS } from "@/lib/content";

export const metadata: Metadata = bookMeta(BOOKS[2]);

export default function Tom3Page() {
  return (
    <BookDetail
      book={BOOKS[2]}
      prev={{ href: "/books/tom-2", title: "«Стеклянные небеса»" }}
    />
  );
}
