/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

// Path to the application's directory, relative to webserver root
// Use `gatsby build --prefix-paths` for this to work. Otherwise, Gatsby will ignore the pathPrefix and build the site as if hosted from the root domain.

module.exports = {
  /* Your site config here */
  siteMetadata: {
    title: 'SWAMP Data Dashboard',
  },
  pathPrefix: '/swamp-data',
  plugins: [],
}
