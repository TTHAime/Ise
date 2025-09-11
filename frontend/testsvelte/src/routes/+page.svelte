<script>
    import logo from "$lib/assets/expenTrack_logo.svg";
    import auth from "$lib/components/auth.svelte";

    let authShow = $state(false);
    let mode = $state('login');
</script>
<style lang="postcss">
    @reference "tailwindcss";
</style>
<div class="flex md:flex-1 md:w mr-4 ml-4 rounded-3xl h-30 justify-center m-5"> <img src={logo} alt="logo"></div>
<h1 class="text-6xl m-5 font-bold bg-gradient-to-r from-blue-500 to-green-300 w-xl bg-clip-text text-transparent">test templete</h1>
<p class="m-5 text-xl">Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
