import type { Metadata } from "next";
import { BookDetail, bookMeta } from "@/components/book-detail";
import { BOOKS } from "@/lib/content";

export const metadata: Metadata = bookMeta(BOOKS[1]);

export default function Tom2Page() {
  return (
    <BookDetail
      book={BOOKS[1]}
      prev={{ href: "/books/tom-1", title: "«Красный сдвиг»" }}
      next={{ href: "/books/tom-3", title: "«Пепел и неон»" }}
    />
  );
}
