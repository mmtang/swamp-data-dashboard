import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

// This component adds a custom title to the page that appears in the browser's tab/window
const Metadata = ({ title, description }) => {
    const data = useStaticQuery(
        graphql`
            query {
                site {
                    siteMetadata {
                        title
                        description
                    }
                }
            }
        `
    )

    const metaTitle = title ? ` | ${title}` : '';
    const metaDescription = description || data.site.siteMetadata.description;

    return (
        <Helmet>
            <title>{`${data.site.siteMetadata.title} ${metaTitle}`}</title>
            <meta name='description' content={metaDescription} />
            <html lang='en' />
        </Helmet>
    )
}

export default Metadata;