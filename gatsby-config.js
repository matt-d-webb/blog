const path = require('path');

module.exports = {
  siteMetadata: {
    title: 'Matt D Webb',
    description: '2000 Days',
    siteUrl: 'https://webb.media', // full path to blog - no ending slash
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorYaml',
  },
  plugins: [{
    resolve: `gatsby-plugin-manifest`,
    options: {
      name: `Webb`,
      short_name: `Webb`,
      start_url: `/`,
      background_color: `#343f44`,
      theme_color: `#3eb0ef`,
      // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
      // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
      display: `standalone`,
      icon: `src/content/avatars/matt.png`, // This path is relative to the root of the site.
      include_favicon: true, // Include favicon
    }
  },
  `gatsby-plugin-offline`,
    'gatsby-plugin-sharp',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'content',
      path: path.join(__dirname, 'src', 'content'),
    },
  },
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-responsive-iframe',
          options: {
            wrapperStyle: 'margin-bottom: 1rem',
          },
        },
        'gatsby-remark-prismjs',
        'gatsby-remark-copy-linked-files',
        'gatsby-remark-smartypants',
        'gatsby-remark-abbr',
        {
          resolve: 'gatsby-remark-images',
          options: {
            maxWidth: 1170,
            quality: 90,
          },
        },
        {
          resolve: 'gatsby-remark-emojis',
          options: {
            // Deactivate the plugin globally (default: true)
            active: true,
            // Add a custom css class
            class: 'emoji-icon',
            // Select the size (available size: 16, 24, 32, 64)
            size: 64,
            // Add custom styles
            styles: {
              display: 'inline',
              margin: '0',
              'margin-top': '1px',
              position: 'relative',
              top: '5px',
              width: '25px'
            }
          }
        }
      ],
    },
  },
    'gatsby-transformer-json',
  {
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: 'https://webb.media',
    },
  },
    'gatsby-plugin-emotion',
    'gatsby-plugin-typescript',
    'gatsby-transformer-sharp',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-yaml',
    'gatsby-plugin-feed',
  {
    resolve: 'gatsby-plugin-postcss',
    options: {
      postCssPlugins: [require('postcss-color-function'), require('cssnano')()],
    },
  },
  'gatsby-plugin-netlify-cms',
  {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
      trackingId: 'UA-137019501-1',
      // Puts tracking script in the head instead of the body
      head: true,
      // IP anonymization for GDPR compliance
      anonymize: true,
      // Disable analytics for users with `Do Not Track` enabled
      respectDNT: true,
      // Avoids sending pageview hits from custom paths
      exclude: ['/preview/**'],
      // Specifies what percentage of users should be tracked
      sampleRate: 100,
      // Determines how often site speed tracking beacons will be sent
      siteSpeedSampleRate: 10,
    },
  },
  ],
};
