import React, { useEffect } from 'react';

const SitemapRoute = () => {
  useEffect(() => {
    // Redirect to the external URL when this route is visited
    window.location.href = 'https://realblog-api.onrender.com/sitemap.xml';
  }, []);

  return (
    <div>
      {/* Your component content */}
    </div>
  );
};

export default SitemapRoute;
