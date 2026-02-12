export const downloadImage = (url: string, contentType: string, isBase64?: boolean) => {
  const link = document.createElement('a');
  link.href = isBase64 ? `data:${contentType};base64,${url}` : url;
  link.download = `img_${new Date()}.jpeg`;
  link.click();
};
