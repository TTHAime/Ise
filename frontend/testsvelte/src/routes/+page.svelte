<script>
    import logo from "$lib/assets/expenTrack_logo.svg";
    import auth from "$lib/components/auth.svelte";

    let authShow = $state(false);
    let mode = $state('login');
</script>
<style lang="postcss">
    @reference "tailwindcss";
</style>
<h1 style="color: black;" class="text-5xl flex justify-center flex-col font-bold text-center mt-20 text-gray-900 dark:text-white">Welcome to ExpenTrack</h1>
