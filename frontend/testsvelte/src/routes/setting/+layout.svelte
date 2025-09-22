<script>
	import { page } from '$app/state';

    const items = [ {label: 'Account', href: '/setting/account'}, {label: 'Category', href: '/setting/category'} ];
</script>

<div class="min-h-[87vh] grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
    <!-- leftside menu -->
     <nav class="h-full rounded-l-2xl bg-[#FFF8EF] mx-4 mt-2 pl-3 pt-2 max-lg:flex max-lg:overflow-x-auto">
        <span class="mx-3 font-bold text-3xl">Setting</span>
        <div class="mt-7">
            {#each items as it}
                <a href ={it.href} class="block rounded-l-xl px-3 py-2 hover:bg-white max-lg:whitespace-nowrap { page.url.pathname.startsWith(it.href)? 'bg-white ' : ''}" aria-current="{page.url.pathname.startsWith(it.href)? 'page' : undefined}">{it.label}</a>
            {/each}
        </div>
     </nav>

     <section class="bg-white p-5 items-start">
        <slot />
     </section>
</div>

