<script lang="ts">
	import TransactionList from '$lib/components/Translist.svelte';
	import Summary from '$lib/components/Summary.svelte'
	import CompareCard from '$lib/components/Compare-line.svelte';
	import Piechart from '$lib/components/Piechart.svelte';
	import type { ApexOptions } from 'apexcharts';

	let chartsize = 430;
	// api data
	const expenseOptions: ApexOptions = {
		series: [40, 25, 20, 15],
		colors: ['#EF4444', '#F97316', '#EAB308', '#06B6D4'],
		chart: {
			width: chartsize,
			height: chartsize,
			type: 'pie' 
		},
		labels: ['Food', 'Rent', 'Utilities', 'Entertainment'],
		stroke: {
			colors: ['white']
		},
		plotOptions: {
			pie: {
				dataLabels: {
					offset: -25
				}
			}
		}
	};

	const incomeOptions: ApexOptions = {
		series: [190, 20, 10],
		colors: ['#22C55E', '#3B82F6', '#A855F7'],
		chart: {
			width: chartsize,
			height: chartsize,
			type: 'pie'
		},
		labels: ['Salary', 'Investments', 'Other'],
		stroke: {
			colors: ['white']
		},
		plotOptions: {
			pie: {
				dataLabels: {
					offset: -25
				}
			}
		}
	};

</script>

<div class="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 drop-shadow-lg md:grid-cols-2">
	<Piechart
		title="Expense"
		description="This chart shows where your money goes each month."
		options={expenseOptions}
	/>
	<Piechart
		title="Income"
		description="This chart shows your different sources of income."
		options={incomeOptions}
	/>
	<TransactionList/>
	<Summary/>
</div>
