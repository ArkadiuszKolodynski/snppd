import asdf from './asdf.svelte';
import { render } from '@testing-library/svelte';

it('it works', async () => {
  const { getByText } = render(asdf);

  expect(getByText('Hello component!'));
});
