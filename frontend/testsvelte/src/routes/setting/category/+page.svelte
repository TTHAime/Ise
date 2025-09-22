<script lang="ts">
    let color = $state('#E74C3C'); //default color
    let colorInput : HTMLInputElement | null = null; //reference to color input

    type Category = { id: string; name: string; color: string; count: number };

    let categories = $state<Category[]>([
        { id: '1', name: 'เงินเดือน',   color: '#2ecc71', count: 3 },
        { id: '2', name: 'รายได้พิเศษ', color: '#f7d154', count: 6 },
        { id: '3', name: 'ของขวัญ',    color: '#d64b88', count: 1 },
        { id: '4', name: 'อื่นๆ',       color: '#9e9e9e', count: 2 },
        { id: '5', name: 'อื่นๆ',       color: '#9e9e9e', count: 2 },
        { id: '6', name: 'อื่นๆ',       color: '#9e9e9e', count: 2 },
        { id: '7', name: 'อื่นๆ',       color: '#9e9e9e', count: 2 },
        { id: '8', name: 'อื่นๆ',       color: '#9e9e9e', count: 2 },
    ]);
</script>

<div class="w-auto md:w-full items-start p-3 justify-start">
    <h2 class="text-xl font-semibold w-full">Create a new Category</h2>
    <div class="flex flex-wrap justify-start items-start w-full"> <!--header-->
        <div class="mt-6 items-start"> 
            <div> <!--Icon Color-->
                <label for="icon-label" class="block text-sm text-neutral-500">Icon</label>

                <button type="button" class="mt-3 w-[72px] h-[72px] rounded-2xl bg-white ring-1 ring-black/15 items-center justify-center" aria-label="Pick icon color" title="Pick icon color">
                    <span class="w-8 h-8 rounded-full" style={`background:${color}`}></span>
                </button>

                <input type="color" bind:this={colorInput} class="sr-only" bind:value={color} />
            </div>
        </div>
        <div class="mt-6 items-start justify-start ml-auto md:ml-10"> <!--Category Name input-->
            <label for="cat-name" class="block text-sm text-neutral-500">Name</label>
            <input type="text" name="cat-name" id="category" class="w-[400px] h-[50px] mt-3 rounded-2xl border border-neutral-300 bg-transparent px-2 py-2 text-neutral-800 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200/60" placeholder="Category Name" />
        </div>

        <div> <!--Category type-->
            <div class="mt-6 justify-start md:ml-10 ml-auto items-start">
                <label for="cat-type" class="block text-sm text-neutral-500">Type</label>
                <div class="w-[150px] mt-3 rounded-2xl border border-neutral-300 bg-transparent px-2 py-2 text-neutral-800 outline-none focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200/60">
                    <select name="cat-type" id="cat-type" class="w-full outline-none text-neutral-800">
                        <option disabled selected value class="text-neutral-800/50">Select Type</option>
                        <option value="expense" class=" text-neutral-800">Expense</option>
                        <option value="income" class=" text-neutral-800">Income</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <section class="mt-10 w-full mx-auto justify-start"> <!--Income Category List-->
        <h3 class="text-lg font-semibold">Income Category</h3>
        <div class="max-h-72 overflow-y-auto pr-2 rounded-lg">
            <ul role="list" class="mt-4 divide-y divide-neutral-200">
                {#each categories as c (c.id)}
                    <li class="flex items-center gap-4 py-3">
                        <span class="inline-block h-6 w-6 rounded-full ring-1 ring-black/10" style={`background:${c.color}`}></span> <!--Category color-->
                        <div class="text-neutral-800">
                            {c.name} <!--Category name-->
                        </div>
                        <div class="ml-auto w-40 text-right text-neutral-500"> {c.count} {c.count === 1? 'transaction' : 'transactions'}</div>
                        <button class="p-2 rounded-lg bg-neutral-300 hover:bg-neutral-500 shadow-sm items-center" aria-label="Edit">Edit</button>
                        <button class="p-2 rounded-lg bg-rose-200 hover:bg-rose-300 shadow-sm items-center" aria-label="Delete">Delete</button>
                    </li>
                {/each}
            </ul>
        </div>
    </section>

    <section class="mt-10 w-full mx-auto justify-start"> <!--Expense Category List-->
        <h3 class="text-lg font-semibold">Expense Category</h3>
        <div class="max-h-72 overflow-y-auto pr-2 rounded-lg">
            <ul role="list" class="mt-4 divide-y divide-neutral-200">
                {#each categories as c (c.id)}
                    <li class="flex items-center gap-4 py-3">
                        <span class="inline-block h-6 w-6 rounded-full ring-1 ring-black/10" style={`background:${c.color}`}></span> <!--Category color-->
                        <div class="text-neutral-800">
                            {c.name} <!--Category name-->
                        </div>
                        <div class="ml-auto w-40 text-right text-neutral-500"> {c.count} {c.count === 1? 'transaction' : 'transactions'}</div>
                        <button class="p-2 rounded-lg bg-neutral-300 hover:bg-neutral-500 shadow-sm items-center" aria-label="Edit">Edit</button>
                        <button class="p-2 rounded-lg bg-rose-200 hover:bg-rose-300 shadow-sm items-center" aria-label="Delete">Delete</button>
                    </li>
                {/each}
            </ul>
        </div>
    </section>
</div>