<script lang="ts">
	import analyticpic from '$lib/assets/analytic.png';
	import type { ApexOptions } from 'apexcharts';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem, Popover } from 'flowbite-svelte';

	export let title: string = 'Finance Chart';
	export let description: string = 'This chart shows your financial breakdown.';
	export let options: ApexOptions;
</script>

<Card
	size="xl"
	class="relative mx-auto flex w-full max-w-2xl flex-col p-4 pt-12 sm:p-6 sm:pt-14 md:p-8 md:pt-16"
>
	<!-- Floating title pill -->
	<div class="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/4">
		<div class="shadow-box mx-2 max-w-3xl rounded-lg bg-white px-4 py-3 sm:px-6 dark:bg-gray-800">
			<div class="flex items-center gap-2">
				<h1 class="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
			</div>
			<Popover
				class="shadow-xs z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
			>
				<div class="space-y-2 p-3">
					<h3 class="font-semibold text-gray-900 dark:text-white">{title} info</h3>
					<p>{description}</p>
				</div>
			</Popover>
		</div>
	</div>

	<!-- Chart (fixed height so footer moves up) -->
	<div class="h-56 px-5 md:h-64">
		<Chart {options} class="h-full w-full" />
	</div>

	<!-- Footer (moved up) -->
	<div class="mt-2 flex justify-end">
		<A
			href="/analytics"
			class="group inline-flex items-center text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
			aria-label="Open analytics"
		>
			<img
				src={analyticpic}
				alt="Analytics"
				class="ml-2 h-7 w-7 will-change-transform group-hover:scale-110 motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out"
			/>
		</A>
	</div>
</Card>
