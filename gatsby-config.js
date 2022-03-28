/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

// Path to the application's directory, relative to webserver root
// Use `gatsby build --prefix-paths` for this to work. Otherwise, Gatsby will ignore the pathPrefix and build the site as if hosted from the root domain.

module.exports = {
  siteMetadata: {
    title: 'SWAMP Data Dashboard',
    description: 'Explore water quality monitoring data collected by the Surface Water Ambient Monitoring Program (SWAMP)'
  },
  pathPrefix: '/swamp-data',
  plugins: [],
}
