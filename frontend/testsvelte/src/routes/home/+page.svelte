<script lang="ts">
	import TransactionList from '$lib/components/Translist.svelte';
	import Summary from '$lib/components/Summary.svelte'
	import CompareCard from '$lib/components/Compare-line.svelte';
	import Piechart from '$lib/components/Piechart.svelte';
	import type { ApexOptions } from 'apexcharts';

	async function load() {
		//api call to get data from backend
		
		return {};
	}

	// common pie opts
	const pieCommon: ApexOptions = {
		chart: { 
			type: 'pie', 
			width: '120%',
			height: '120%'
		},
		stroke: { colors: ['#ffffff'] },
		plotOptions: { pie: { dataLabels: { offset: -25 } } },
		// tweak labels on small screens
		responsive: [
			{ breakpoint: 768, options: { plotOptions: { pie: { dataLabels: { offset: -15 } } } } }
		]
	};

	const expenseOptions: ApexOptions = {
		...pieCommon,
		series: [40, 25, 20, 15],
		colors: ['#EF4444', '#F97316', '#EAB308', '#06B6D4'],
		labels: ['Food', 'Rent', 'Utilities', 'Entertainment']
	};

	const incomeOptions: ApexOptions = {
		...pieCommon,
		series: [190, 20, 10],
		colors: ['#22C55E', '#3B82F6', '#A855F7'],
		labels: ['Salary', 'Investments', 'Other']
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
	<TransactionList />
	<Summary />
</div>
