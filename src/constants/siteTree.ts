export type SiteNode = {
  label: string;
  path: string;
  children?: SiteNode[];
  /* If dynamic is true,
   * label and path are resolved at runtime from the current page. 
   */
  dynamic?: true;
};

export const siteTree: SiteNode = {
  label: 'Prottoy Fuad',
  path: '/',
  children: [
    { label: 'About', path: '/about/' },
    {
      label: 'Blogs',
      path: '/blogs/',
      children: [
        // Represents any individual blog post. Resolved client-side.
        { label: '', path: '', dynamic: true },
      ],
    },
  ],
};
