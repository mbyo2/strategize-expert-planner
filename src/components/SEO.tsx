
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

const SEO: React.FC<SEOProps> = ({
  title = 'Intantiko - Strategic Intelligence Platform',
  description = 'Streamline your strategic planning, monitor industry trends, and align your teams with our comprehensive business intelligence platform.',
  keywords = 'strategic planning, business intelligence, industry analysis, team management, strategic intelligence',
  ogImage = '/og-image.png',
  ogUrl = window.location.href,
  twitterCard = 'summary_large_image',
}) => {
  const siteName = 'Intantiko';
  
  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#0f172a" />
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};

export default SEO;
