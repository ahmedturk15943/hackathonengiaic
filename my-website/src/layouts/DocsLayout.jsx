import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SidebarChatbot from '@site/src/components/SidebarChatbot';

const DocsLayout = (props) => {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout {...props} description={props.description || siteConfig.tagline}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '0' }}>
        <div style={{ flex: 1 }}>
          {props.children}
        </div>
        <div style={{ marginLeft: '20px', position: 'relative' }}>
          <SidebarChatbot backendUrl="http://localhost:8000/api/v1" />
        </div>
      </div>
    </Layout>
  );
};

export default DocsLayout;