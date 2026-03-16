export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  moodImage?: string;
  moodDescription?: string;
  tags: string[];
  excerpt: string;
  image?: string;
  content: string;
  year: string;
  month: string;
}

export interface PostsByYear {
  [year: string]: {
    [month: string]: BlogPost[];
  };
}

export interface TagCount {
  tag: string;
  count: number;
}
