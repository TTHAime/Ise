<script>
    import logo from "$lib/assets/expenTrack_logo.svg";
    import { goto } from '$app/navigation';
	import { error } from "@sveltejs/kit";

    let {user = null, loginClick=()=>{}, signupClick=() => {}, logoutClick=()=>{}} = $props();

    function navigateTo(where) {
        goto(`/${where}`);
      }
</script>

<style lang="postcss">
    @reference "tailwindcss";
    .header {
	display: flex;
	justify-content: space-between;
	view-transition-name: header;
    }
</style>

<nav class="header font-mono bg-gray-300 bg-auto md:bg-contain mx-4 mt-4 p-4 rounded-md justify-between flex align-middle drop-shadow-lg">
    <img src={logo} alt="ExpenTrack" class="h-13 w-13 ml-2">
    <label class="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mr-auto ml-4 mt-2">ExpenTrack</label>
    <ul class="mr-2 justify-center align-middle mt-4 space-x-10">
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => navigateTo("")}>Help</button>
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => navigateTo("etc")}>About Us</button>
    {#if user}
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => logoutClick()}>logout</button>
    {:else}
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => loginClick()}>log in</button>
        <button class="cursor-pointer hover:bg-gray-400/50 rounded-sm" type="button" onclick={() => signupClick()}>Sign up</button>
    {/if}
    </ul>
</nav>