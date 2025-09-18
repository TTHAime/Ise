<script lang="ts">
    import { Card, Popover } from 'flowbite-svelte';
    
	type TxType = 'INCOME' | 'EXPENSE';

    //scrolloable max height
	export let maxHeight = '16rem';//16 is ideal 5 items
    
    let data = {//pass in from parent
        title: 'Recent Transactions',
        items: [
            { id: 1, description: 'Grocery Shopping', amount: 50.75, date: '2025-10-01', type: 'EXPENSE' as TxType },
            { id: 2, description: 'Electricity Bill', amount: 75.0,  date: '2025-10-03', type: 'EXPENSE' as TxType },
            { id: 3, description: 'investment', amount: 30.0, date: '2025-10-05', type: 'INCOME' as TxType },
            { id: 4, description: 'Monthly Subscription', amount: 12.50, date: '2025-10-07', type: 'EXPENSE' as TxType },
            { id: 5, description: 'Salary', amount: 17800, date: '2025-10-10', type: 'INCOME'  as TxType },//max 5 or not
            { id: 6, description: 'Freelance Project', amount: 500.0, date: '2025-10-12', type: 'INCOME' as TxType },
            { id: 7, description: 'Dining Out', amount: 60.0, date: '2025-10-15', type: 'EXPENSE' as TxType },
            { id: 8, description: 'Gym Membership', amount: 40.0, date: '2025-10-18', type: 'EXPENSE' as TxType },
            { id: 9, description: 'Book Purchase', amount: 20.0, date: '2025-10-20', type: 'EXPENSE' as TxType },
            { id: 10, description: 'Car Maintenance', amount: 150.0, date: '2025-10-22', type: 'EXPENSE' as TxType }
        ]
    };
	// let data = {
	// 	title: 'Recent Transactions',
	// 	items: [] as Array<{ id: number; description: string; amount: number; date: string; type: TxType }>
	// };

	const amountText = (amt: number, type: TxType) =>
		type === 'EXPENSE' ? `-${amt.toFixed(2)} Baht` : `+${amt.toFixed(2)} Baht`;

	const amountClass = (type: TxType) =>
		type === 'EXPENSE' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400';

    //icon by cate naja
	const iconFor = (type: TxType) => (type === 'INCOME' ? '💸' : '🧾');
</script>

<Card
	size="xl"
	class="relative mx-auto flex w-full max-w-2xl flex-col p-4 pt-12 sm:p-6 sm:pt-14 md:p-8 md:pt-16"
>
	<!-- Floating title pill -->
	<div class="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/4">
		<div class="shadow-box mx-2 max-w-3xl rounded-lg bg-white px-4 py-3 sm:px-6 dark:bg-gray-800">
			<div class="flex items-center gap-2">
				<h1 class="text-xl font-bold text-gray-900 dark:text-white">Transaction</h1>
			</div>
			<Popover
				class="shadow-xs z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
			>
				<div class="space-y-2 p-3">
					<h3 class="font-semibold text-gray-900 dark:text-white">Transaction info</h3>
					<p>show recent transaction</p>
				</div>
			</Popover>
		</div>
	</div>

	<!-- Scrollable List / Empty state -->
	<div
		class="mt-1 sm:mt-6 overflow-y-auto overscroll-contain pr-2"
		style={`max-height:${maxHeight};scrollbar-gutter:stable;`}
		aria-label="Recent transactions"
	>
		{#if data.items && data.items.length > 0}
			<ul class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.items as item (item.id)}
					<li class="flex items-center justify-between gap-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-md px-2">
						<div class="flex items-center gap-3 min-w-0">
							<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-gray-200 bg-white text-base dark:bg-gray-800 dark:ring-gray-700">
								{iconFor(item.type)}
							</span>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-gray-900 dark:text-white">{item.description}</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
							</div>
						</div>

						<div class={"shrink-0 text-sm font-semibold " + amountClass(item.type)}>
							{amountText(item.amount, item.type)}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<div
				class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700"
				aria-live="polite"
			>
				<div class="text-3xl">🗒️</div>
				<p class="text-sm font-medium text-gray-900 dark:text-white">No transactions yet</p>
				<p class="text-xs text-gray-500 dark:text-gray-400">Add an income or expense to see it here.</p>
				<slot name="emptyAction" />
			</div>
		{/if}
	</div>
</Card>

<style>
	/* optional: slimmer, neutral scrollbar */
	:global(.overflow-y-auto::-webkit-scrollbar) { width: 8px; }
	:global(.overflow-y-auto::-webkit-scrollbar-track) { background: transparent; }
	:global(.overflow-y-auto::-webkit-scrollbar-thumb) { background: rgba(100,100,100,.35); border-radius: 8px; }
	:global(.overflow-y-auto:hover::-webkit-scrollbar-thumb) { background: rgba(100,100,100,.55); }
	/* Firefox */
	:global(.overflow-y-auto) { scrollbar-width: thin; scrollbar-color: rgba(100,100,100,.35) transparent; }
</style>
