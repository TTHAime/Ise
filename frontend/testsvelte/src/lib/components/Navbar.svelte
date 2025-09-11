<script>
    import logo from "$lib/assets/expenTrack_logo.svg";
    let {user = null, loginClick=()=>{}, signupClick=() => {}, logoutClick=()=>{}} = $props();
</script>

<style lang="postcss">
    @reference "tailwindcss";
</style>

<nav class="font-mono bg-gray-300 bg-auto md:bg-contain mx-4 mt-4 p-4 rounded-md justify-between flex align-middle drop-shadow-lg">
    <img src={logo} alt="ExpenTrack" class="h-13 w-13 ml-2">
    <ul class="mr-2 justify-center align-middle mt-4 space-x-10">
        {#if user}
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => logoutClick()}>logout</button>
    {:else}
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => loginClick()}>log in</button>
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => signupClick()}>Sign up</button>
    {/if}
    </ul>
</nav>