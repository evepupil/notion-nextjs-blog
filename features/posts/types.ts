import type { Locale } from "@/features/i18n/lib/config";

export type PostHeading = {
  depth: number;
  text: string;
  slug: string;
};

export type PostSummary = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  lang: string;
  translationKey: string;
  draft: boolean;
  pinned: boolean;
  published: Date;
  updated?: Date;
  readingTime: {
    text: string;
    minutes: number;
    words: number;
  };
  headings: PostHeading[];
};

export type Post = PostSummary & {
  markdown: string;
};
