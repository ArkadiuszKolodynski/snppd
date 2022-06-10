<script lang="ts">
  import App from '../app/App.svelte';

  const app = new App({
    target: document.body,
    props: {
      name: 'frontend',
    },
  });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
