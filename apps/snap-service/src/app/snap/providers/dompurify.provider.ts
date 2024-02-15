import * as DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { DOM_PURIFY } from '../../constants';

export const DOMPurifyProvider = {
  provide: DOM_PURIFY,
  useFactory: () => {
    const domPurify = DOMPurify(new JSDOM('').window);
    domPurify.setConfig({ WHOLE_DOCUMENT: true });
    return domPurify;
  },
};
