<script lang="ts">
    import AddTransaction  from "./AddTransaction.svelte";

	type Txn = {
		id: string | number;
		date: string | Date; // ISO string หรือ Date ก็ได้
		category: string; // เช่น เงินเดือน / ความบันเทิง
		note?: string; // รายละเอียดสั้น ๆ
		amount: number; // บวก = รายรับ, ลบ = รายจ่าย
	};

	// รับรายการธุรกรรมเข้ามา (ตัวอย่างค่าเริ่มต้นให้ดูหน้าตา)
	export let transactions: Txn[] = [
		{
			id: 1,
			date: '2025-09-01',
			category: 'เงินเดือน',
			note: 'รายได้จากที่ทำงาน',
			amount: 10000
		},
		{
			id: 2,
			date: '2025-09-01',
			category: 'ความบันเทิง',
			note: 'ค่าคอนเสิร์ต',
			amount: -6000
		}
	];

	const dateLabel = (d: string | Date) =>
		new Date(d).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}); // => "1 Sep 2025"

	const formatAmount = (n: number) => {
		const sign = n > 0 ? '+' : n < 0 ? '-' : '';
		const absTxt = Math.abs(n).toLocaleString('en-US');
		return `${sign}${absTxt} THB`;
	};

	// จัดกลุ่มตามวันที่ (label)
	$: grouped = Object.entries(
		transactions.reduce<Record<string, Txn[]>>((acc, t) => {
			const key = dateLabel(t.date);
			(acc[key] ??= []).push(t);
			return acc;
		}, {})
	);
</script>

<!-- Card รวมทั้งหมด -->
<div
	class="shadow-box mx-auto w-[90%] rounded-2xl border
         border-gray-200 bg-white p-4
         sm:p-6 md:w-[80%] md:p-8
         lg:w-[90%]"
>
	{#each grouped as [label, items]}
		<section class="mb-2 last:mb-0">
			<h3 class="mb-3 text-lg font-semibold text-gray-900">{label}</h3>

			<ul class="divide-y divide-gray-100">
				{#each items as t (t.id)}
					<li class="flex items-center gap-3 py-3">
						<!-- จุดสีซ้าย: เขียว = รายรับ, แดง = รายจ่าย -->
						<span
							class="inline-block h-5 w-5 rounded-full"
							class:bg-green-400={t.amount > 0}
							class:bg-red-500={t.amount < 0}
							aria-hidden="true"
						></span>

						<!-- เนื้อหากลาง -->
						<div class="min-w-0 flex-1">
							<div class="truncate text-base font-medium text-gray-800">
								{t.category}
							</div>
							{#if t.note}
								<div class="truncate text-sm text-gray-500">{t.note}</div>
							{/if}
						</div>

						<!-- จำนวนเงินขวา -->
						<div
							class="ml-2 shrink-0 text-right text-base font-semibold"
							class:text-green-500={t.amount > 0}
							class:text-red-500={t.amount < 0}
						>
							{formatAmount(t.amount)}
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	/* ปรับมุม/เงาไว้แล้วใน Tailwind classes ด้านบน */
</style>
