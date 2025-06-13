
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Strategic Dashboard", 
  description = "Comprehensive strategic planning and analytics platform" 
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
};

export default SEO;
