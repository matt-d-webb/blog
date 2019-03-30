export interface WebsiteConfig {
  title: string;
  description: string;
  coverImage: string;
  logo: string;
  /**
   * Specifying a valid BCP 47 language helps screen readers announce text properly.
   * See: https://dequeuniversity.com/rules/axe/2.2/valid-lang
   */
  lang: string;
  /**
   * blog full path, no ending slash!
   */
  siteUrl: string;
  mailchimpAction?: string;
  mailchimpName?: string;
}

const config: WebsiteConfig = {
  title: 'M.D.Webb',
  description: '2000 Days',
  coverImage: 'img/blog-cover.jpg',
  logo: 'img/ghost-matt.png',
  lang: 'en',
  siteUrl: 'https://webb.media/'
};

export default config;
