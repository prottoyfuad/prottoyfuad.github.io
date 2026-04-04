export type TemplateVars = Record<string, string>;

export interface PostFrontmatter {
  id?: string;
  title?: string;
  author?: string;
  date: string;
}

export interface Templates {
  index: string;
  blogs: string;
  about: string;
  post: string;
  notFound: string;
}
