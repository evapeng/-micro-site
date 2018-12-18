import React from 'react';
import Layout from '../components/layout';
import { Link, graphql, StaticQuery } from 'gatsby';


import rehypeReact from 'rehype-react';
const DemoComponent = (props) => {
  return (<p style={{textTransform: 'uppercase'}}> {props.children} </p>)
}
const renderAst = new rehypeReact({
  createElement: React.createElement,
  components: {
   'p': DemoComponent
  },
}).Compiler

export default ({ data, pageContent }) => {
 const post = data.markdownRemark;
 let currentPage = post.fields.currentPage;
 let slug = post.fields.slug;
 return (
  <Layout>
   <div style={{padding: '40px 80px', maxWidth: '1200px'}}>
    <h1>{post.frontmatter.title}</h1><br/>
    <p> {renderAst(post.htmlAst)} </p>
   </div>
  </Layout>
 )
}
export const query = graphql`
  query PageQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      fields {
        slug
        currentPage
      }
      frontmatter {
        title
      }
    }
  }
`;