import { convert } from 'html-to-text';

export const convertHtmlToText = (htmlContent: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const textContent = convert(htmlContent);
      resolve(textContent);
    } catch (err) {
      reject(err);
    }
  });
};
