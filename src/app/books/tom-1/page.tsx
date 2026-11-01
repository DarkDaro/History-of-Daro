import type { Metadata } from "next";
import { BookDetail, bookMeta } from "@/components/book-detail";
import { BOOKS } from "@/lib/content";

export const metadata: Metadata = bookMeta(BOOKS[0]);

export default function Tom1Page() {
  return (
    <BookDetail
      book={BOOKS[0]}
      next={{ href: "/books/tom-2", title: "«Стеклянные небеса»" }}
    />
  );
}
