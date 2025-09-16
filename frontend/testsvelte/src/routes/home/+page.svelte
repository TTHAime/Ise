<script lang="ts">
	import CompareCard from '$lib/components/Compare-line.svelte';
	import Piechart from '$lib/components/Piechart.svelte';
	import type { ApexOptions } from 'apexcharts';

	// api data
	const expenseOptions: ApexOptions = {
		series: [40, 25, 20, 15],
		colors: ['#EF4444', '#F97316', '#EAB308', '#06B6D4'],
		chart: { type: 'pie' },
		labels: ['Food', 'Rent', 'Utilities', 'Entertainment']
	};

	const incomeOptions: ApexOptions = {
		series: [70, 20, 10],
		colors: ['#22C55E', '#3B82F6', '#A855F7'],
		chart: { type: 'pie' },
		labels: ['Salary', 'Investments', 'Other']
	};
</script>

<div class="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-14 drop-shadow-lg md:grid-cols-2">
	<Piechart
		title="Expense Breakdown"
		description="This chart shows where your money goes each month."
		options={expenseOptions}
		menuType="expense"
	/>
	<Piechart
		title="Income Breakdown"
		description="This chart shows your different sources of income."
		options={incomeOptions}
		menuType="income"
	/>
</div>
