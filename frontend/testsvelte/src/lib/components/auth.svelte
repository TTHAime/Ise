<script lang="ts">
    import {fade, scale} from "svelte/transition";
    import {tick,  onMount} from "svelte";

    let firstField : HTMLInputElement | null = null;
    let overlay : HTMLDivElement | null = $state(null);


    let { open = false, mode = 'login',login = () => {}, signup = () => {},  onClose = () => {}} = $props();

    function close(){
        onClose();
    }

    function clickBackDrop(e : MouseEvent) {
        console.log(e.target);
        if(e.target === e.currentTarget){
            console.log("click back drop");
            close();
        }
    }

    async function makeFocus(){
        await tick();
        overlay?.focus();
        firstField?.focus();
    }
</script>

<svelte:window on:keydown={(e) => open && e.key === 'Escape' && close()} />
{#if open}
    <!-- Backdrop + blur -->
    <div bind:this={overlay} tabindex="-1" class="fixed inset-0 z-40 backdrop-blur-sm bg-black/50" transition:fade={{duration: 100}}>
    </div>

    <!-- Modal login/sign up -->
    <div class="fixed z-50 inset-0 flex items-center justify-center pt-4 pb-4 h-md max-h-md overflow-auto" onclick={clickBackDrop} aria-hidden="true">
        <div role="dialog" aria-modal="true" aria-labelledby="auth-title" class="w-full max-w-md h-full overflow-auto bg-white dark:bg-neutral-900 shadow-xl ring-1 ring-black/5 rounded-2xl" 
        transition:scale={{duration: 160, start: 0.80}}></div>
    </div>
{/if}