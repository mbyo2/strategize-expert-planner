
import React from 'react';

const SecurityHeaders: React.FC = () => {
  React.useEffect(() => {
    // Set security headers via meta tags
    const metaTags = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' }
    ];

    metaTags.forEach(({ name, content }) => {
      const existingTag = document.querySelector(`meta[name="${name}"]`);
      if (!existingTag) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }, []);

  return null;
};

export default SecurityHeaders;
