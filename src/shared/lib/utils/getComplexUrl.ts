export const getComplexUrl = () => {
  let url = window.COMPLEX_API_URL;

  if (url && url.toLowerCase().includes('gateway')) {
    const urlArray = url.split('/');
    url = urlArray.slice(0, urlArray.length - 1).join('/');
  }

  return url;
};
