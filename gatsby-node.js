/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  // If the node type (file) is a markdown file
  if (node.internal.type === 'MarkdownRemark') {
    const dir = path.resolve(__dirname, '');
    const fileNode = getNode(node.parent);
    // Helper function to create a file path
    const slug = createFilePath({
      node,
      getNode,
      basePath: `documentation`,
      trailingSlash: false,
    });
    const currentPage = slug.split('/').pop();
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
    createNodeField({
      node,
      name: `currentPage`,
      value: currentPage,
    });
  }
};

exports.createPages = ({ actions: { createPage }, graphql}) => {
 return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              currentPage
            }
            frontmatter {
             date
            }
          }
        }
      }
    }
  `).then(result => {
   result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const slug = node.fields.slug;
    const currentPage = node.fields.currentPage;
    let currentPath = slug.slice(0, slug.lastIndexOf(currentPage));
    createPage({
     path: currentPath,
     component: path.resolve('./src/templates/page.js'),
     context: {
      slug,
      currentPage: '${currentPath}${current}',
     },
    });
   })
  })
}