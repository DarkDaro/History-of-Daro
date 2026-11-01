import type { Metadata } from "next";
import { ChronicleDetail, chronicleMeta } from "@/components/chronicle-detail";
import { CHRONICLES } from "@/lib/content";

const chronicle = CHRONICLES[0];

export const metadata: Metadata = chronicleMeta(chronicle);

export default function PobegOhotnikaPage() {
  return <ChronicleDetail chronicle={chronicle} />;
}
