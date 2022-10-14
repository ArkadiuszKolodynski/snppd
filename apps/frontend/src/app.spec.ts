/**
 * @jest-environment jsdom
 */

import 'svelte';
import App from './App.svelte';

describe('app', () => {
  test('test', () => {
    const app = new App({
      target: document.body,
      props: {
        name: 'frontend',
      },
    });
    expect(app).toBe(app);
  });
});
