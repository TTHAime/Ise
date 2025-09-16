<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem, Popover } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		ChevronDownOutline,
		ChevronRightOutline,
		PenSolid,
		DownloadSolid,
		ShareNodesSolid,
		TrashBinSolid,
		DotsHorizontalOutline
	} from 'flowbite-svelte-icons';

	// Props
	export let title: string = 'Finance Chart';
	export let description: string = 'This chart shows your financial breakdown.';
	export let options: ApexOptions;
	export let menuType: 'expense' | 'income' = 'expense';
</script>


<!-- size fix later,or maybe if else window size instead -->
<Card size="xl" class="p-4 sm:p-6 md:p-8 w-[30rem]">
	<!-- Header -->
	<div class="flex w-full items-start justify-between">
		<div class="flex-col items-center">
			<div class="mb-1 flex items-center">
				<h5 class="me-1 text-xl font-bold text-gray-900 dark:text-white">{title}</h5>

				<!-- Info icon + popover -->
				<InfoCircleSolid
					id="piechart-info"
					class="ms-1 h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
				/>
				<Popover
					triggeredBy="#piechart-info-trigger"
					class="shadow-xs z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
				>
					<div class="space-y-2 p-3">
						<h3 class="font-semibold text-gray-900 dark:text-white">{title} info</h3>
						<p>{description}</p>
					</div>
				</Popover>
			</div>
		</div>

		<!-- Dropdown menu -->
		<div class="flex items-center justify-end">
			<DotsHorizontalOutline id="drop-h" class="dark:text-white" />
			<Dropdown simple triggeredBy="hop-h-trigger" class="w-44" offset={-6}>
				{#if menuType === 'expense'}
					<DropdownItem><PenSolid class="me-2 inline h-3 w-3" /> Edit categories</DropdownItem>
				{:else}
					<DropdownItem><PenSolid class="me-2 inline h-3 w-3" /> Edit sources</DropdownItem>
				{/if}
				<DropdownItem><DownloadSolid class="me-2 inline h-3 w-3" /> Export data</DropdownItem>
				<DropdownItem><ShareNodesSolid class="me-2 inline h-3 w-3" /> Share report</DropdownItem>
				<DropdownItem><TrashBinSolid class="me-2 inline h-3 w-3" /> Delete chart</DropdownItem>
			</Dropdown>
		</div>
	</div>

	<!-- Chart -->
	<Chart {options} class="py-6" />

	<!-- Footer -->
	<div class="flex justify-between border-t border-gray-200 pt-5 dark:border-gray-700">
		<Button class="bg-transparent text-sm text-gray-500 dark:text-gray-400">
			Last 30 days <ChevronDownOutline class="ms-1 w-2.5" />
		</Button>
		<A href="/" class="text-sm font-semibold uppercase hover:underline">View details</A>
	</div>
</Card>
