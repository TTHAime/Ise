<script lang="ts">
	import type { ApexOptions } from 'apexcharts';
	import { Chart } from '@flowbite-svelte-plugins/chart';
	import { Card, A, Button, Dropdown, DropdownItem, Popover } from 'flowbite-svelte';
	import {
		InfoCircleSolid,
		ChevronRightOutline,
		ChevronDownOutline,
		FileLinesSolid
	} from 'flowbite-svelte-icons';

    let period = $state('7d');//need to reactive with the data

	let options: ApexOptions = {
		chart: {
			height: '200px',
			// width: '700',//ideal width
			type: 'line',
			fontFamily: 'Inter, sans-serif',
			dropShadow: { enabled: false },
			toolbar: { show: false }
		},
		tooltip: {
			enabled: true,
			x: { show: false }
		},
		dataLabels: { enabled: false },
		stroke: { width: 4, curve: 'smooth' },
		grid: {
			show: true,
			strokeDashArray: 4,
			padding: { left: 2, right: 2, top: -26 }
		},
		series: [//mock data
			{
				name: 'Income',
				data: [1200, 1400, 1350, 1600, 1500, 1700, 1800,1200],
				color: '#16a34a' // green
			},
			{
				name: 'Expenses',
				data: [800, 950, 1000, 1100, 1050, 1200, 1150,1400],
				color: '#dc2626' // red
			}
		],
		legend: { show: false },
		xaxis: {
			categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon'],//need to auto repeat
			labels: {
				show: true,
				style: {
					fontFamily: 'Inter, sans-serif',
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			},
			axisBorder: { show: false },
			axisTicks: { show: false }
		},
		yaxis: {
			show: true,
			labels: {
				style: {
					cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
				}
			}
		}
	};
</script>

<Card class="p-4 md:p-6">
	<!-- Top Section -->
	<div class="mb-5 flex justify-between">
		<div class="grid grid-cols-2 gap-4">
			<!-- Income -->
			<div>
				<h5
					class="mb-2 inline-flex items-center font-normal leading-none text-gray-500 dark:text-gray-400"
				>
					Income
					<InfoCircleSolid
						id="i1"
						class="ms-1 h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-900 dark:hover:text-white"
					/>
					<Popover
						triggeredBy="#i1"
						class="shadow-xs z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
					>
						<div class="space-y-2 p-3">
							<h3 class="font-semibold text-gray-900 dark:text-white">Income Overview</h3>
							<p>
								Shows how much money you earned during the selected period. A steady upward trend
								indicates healthy financial growth.
							</p>
							<A href="/">
								Read more <ChevronRightOutline class="ms-1.5 h-2 w-2" />
							</A>
						</div>
					</Popover>
				</h5>
				<p class="text-2xl font-bold leading-none text-gray-900 dark:text-white">$7,800</p>
			</div>

			<!-- Expenses -->
			<div>
				<h5
					class="mb-2 inline-flex items-center font-normal leading-none text-gray-500 dark:text-gray-400"
				>
					Expenses
					<InfoCircleSolid
						id="i2"
						class="ms-1 h-3 w-3 cursor-pointer text-gray-400 hover:text-gray-900 dark:hover:text-white"
					/>
					<Popover
						triggeredBy="#i2"
						class="shadow-xs z-10 w-72 rounded-lg border border-gray-200 bg-white text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
					>
						<div class="space-y-2 p-3">
							<h3 class="font-semibold text-gray-900 dark:text-white">Expense Overview</h3>
							<p>
								Shows how much you spent during the selected period. Monitoring your spending helps
								you save more effectively.
							</p>
							<A href="/">
								Read more <ChevronRightOutline class="ms-1.5 h-2 w-2" />
							</A>
						</div>
					</Popover>
				</h5>
				<p class="text-2xl font-bold leading-none text-gray-900 dark:text-white">$6,200</p>
			</div>
		</div>

		<!-- Date Selector -->
		<div>
			<Button color="light" class="px-3 py-2">
				{period} <ChevronDownOutline class="ms-1.5 h-2.5 w-2.5" />
			</Button>
			<Dropdown simple class="w-40">
				<!-- <DropdownItem onclick={() => period = "Last 7 days"}>Today</DropdownItem> -->
				<DropdownItem onclick={() => period = "Last 7 days"}>Last 7 days</DropdownItem>
				<DropdownItem onclick={() => period = "Last 30 days"}>Last 30 days</DropdownItem>
				<DropdownItem onclick={() => period = "Last 90 days"}>Last 90 days</DropdownItem>
			</Dropdown>
		</div>
	</div>

	<!-- Chart -->
	<Chart {options} />

	<!-- Footer -->
	<div
		class="mt-2.5 grid grid-cols-1 items-center justify-between border-t border-gray-200 dark:border-gray-700"
	>
		<div class="pt-5">
			<Button
				href="/analytics"
				class="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 focus:outline-hidden inline-flex items-center rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white focus:ring-4"
			>
				<FileLinesSolid class="me-2 h-3.5 w-3.5 text-white" />
				View full expense report
			</Button>
		</div>
	</div>
</Card>
