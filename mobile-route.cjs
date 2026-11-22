'use strict';

function mobileHomepage(url, method, userAgent) {
  // The versioned URL belongs to the service worker's desktop shell.
  return ['GET', 'HEAD'].includes(method) && ['/', '/index.html'].includes(url.pathname)
    && !url.searchParams.has('v') && /Android|iPhone|iPad|iPod/i.test(userAgent || '');
}

module.exports = { mobileHomepage };
