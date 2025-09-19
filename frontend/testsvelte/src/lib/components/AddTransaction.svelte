<script lang="ts">
	import { fade } from 'svelte/transition';
	import { ButtonToggleGroup, ButtonToggle } from 'flowbite-svelte';

	let singleValue: 'red' | 'green' = $state('green');

	function handleSingleSelect(v: 'red' | 'green') {
		singleValue = v;
	}

	const panelClass = $derived(
		singleValue === 'green' ?  'box-transaction-income' : 'box-transaction-expense'
	);

	// Type recue
	type Recurrence = 'NEVER' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
	export type SubmitPayload = {
        type : 'INCOME' | 'EXPENSE';
		category: string | null;
		date: string;
		note: string;
		amount: number;
		currency: string;
		recurrence: Recurrence;
		ends: 'NEVER' | string;
		receipt?: File | null;
	};

	const props = $props<{
		open?: boolean;
		onClose?: () => void;
		periodText?: string;
		categories?: string[];
		currencies?: string[];
		onPrevPeriod?: () => void;
		onNextPeriod?: () => void;
		onSubmit?: (payload: SubmitPayload) => void;
	}>();

	// lerter
	const open = $derived(props.open ?? false);
	const onClose = $derived(props.onClose ?? (() => {}));
	const periodText = $derived(props.periodText ?? '');
	const categories = $derived(props.categories ?? []);
	const currencies = $derived(props.currencies ?? ['THB']);
	const onSubmit = $derived(props.onSubmit ?? ((_: SubmitPayload) => {}));

	let firstField: HTMLSelectElement | null = $state(null);
	let receiptInput: HTMLInputElement | null = $state(null);

	let categorySel = $state(''); // '' -> null on submit
	let date = $state(new Date().toISOString().slice(0, 10));
	let note = $state('');
	let amount: number | '' = $state('');
	let currency = $state(currencies[0] ?? 'THB');

	let recurrence: Recurrence = $state('NEVER');
	let endsType: 'NEVER' | 'ON' = $state('NEVER');
	let endsOn = $state(new Date().toISOString().slice(0, 10));

	let receiptFile: File | null = $state(null);

	// Keep "Ends" in sync with recurrence
	$effect(() => {
		if (recurrence === 'NEVER' && endsType !== 'NEVER') endsType = 'NEVER';
	});

	// Modal helpers
	function close() {
		onClose();
	}

	// receipt helpers
	function pickReceipt() {
		receiptInput?.click();
	}
	function onFileChange(e: Event) {
		const f = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
		receiptFile = f;
	}
	function clearReceipt() {
		if (receiptInput) receiptInput.value = '';
		receiptFile = null;
	}

	function onBackdropClick(e: MouseEvent) {
		if (e.currentTarget === e.target) close();
	}
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const value = Number(amount);
		const category = categorySel || null;
		if (!category) return alert('Please select a category.');
		if (!value || Number.isNaN(value) || value <= 0) return alert('Please enter a valid amount.');
		onSubmit({
            type: singleValue === 'red' ? 'EXPENSE' : 'INCOME',
			category,
			date,
			note: note.trim(),
			amount: value,
			currency,
			recurrence,
			ends: endsType === 'NEVER' ? 'NEVER' : endsOn,
			receipt: receiptFile ?? undefined
		});
	}
</script>

<svelte:window on:keydown={(e) => open && e.key === 'Escape' && close()} />

{#if open}
	<div class="fixed inset-0 z-40 flex items-start items-center justify-center sm:p-40">
		<!-- Backdrop -->
		<div
			onclick={onBackdropClick}
			class="absolute inset-0 bg-black/50"
			transition:fade={{ duration: 100 }}
			aria-hidden="true"
		></div>

		<!-- Modal panel -->
		<div
			class="box-transaction relative z-10 w-auto rounded-3xl bg-white p-6 shadow ring-1 ring-black/10 dark:bg-gray-900 {panelClass}"
		>
			<!-- Header -->
			<ButtonToggleGroup onSelect={handleSingleSelect}>
				<ButtonToggle color="red" value="red" selected={singleValue === 'red'}>Expense</ButtonToggle
				>
				<ButtonToggle color="green" value="green" selected={singleValue === 'green'}
					>Income</ButtonToggle
				>
			</ButtonToggleGroup>
			<!-- Close button -->
			<button
				type="button"
				class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800"
				aria-label="Close"
				onclick={close}
			>
				<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<div class="mb-4 flex items-center justify-between"></div>

			<form onsubmit={handleSubmit} class="space-y-6">
				<!-- Row 1 -->
				<div class="grid grid-cols-1 gap-4 md:grid-cols-12">
					<div class="md:col-span-3">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Category
							<div class="flex items-center rounded-2xl ring-1 ring-gray-300 dark:ring-gray-700">
								<select
									bind:value={categorySel}
									class="w-full rounded-2xl bg-transparent px-4 py-3 outline-none"
									bind:this={firstField}
								>
									<option value="" disabled selected>Select Category</option>
									{#each categories as c}<option value={c}>{c}</option>{/each}
								</select>
							</div>
						</label>
					</div>

					<div class="md:col-span-3">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Date
							<input
								type="date"
								bind:value={date}
								class="w-full rounded-2xl px-4 py-3 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-transparent dark:ring-gray-700"
							/>
						</label>
					</div>

					<div class="md:col-span-3">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Note
							<input
								type="text"
								placeholder="Write Note"
								bind:value={note}
								class="w-full rounded-2xl px-4 py-3 ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-transparent dark:ring-gray-700"
							/>
						</label>
					</div>

					<div class="md:col-span-2">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Amount
							<input
								type="number"
								min="0"
								step="0.01"
								placeholder="0.00"
								bind:value={amount}
								class="w-full rounded-2xl px-4 py-3 text-right ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 dark:bg-transparent dark:ring-gray-700"
							/>
						</label>
					</div>

					<div class="md:col-span-1">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Currency
							<div class="flex items-center rounded-2xl ring-1 ring-gray-300 dark:ring-gray-700">
								<select
									bind:value={currency}
									class="w-full rounded-2xl bg-transparent px-4 py-3 outline-none"
								>
									{#each currencies as cur}<option value={cur}>{cur}</option>{/each}
								</select>
							</div>
						</label>
					</div>
				</div>

				<!-- Row 2 -->
				<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
					<div class="md:col-span-3">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Auto Recurrence
							<select
								bind:value={recurrence}
								class="w-full rounded-2xl px-4 py-3 ring-1 ring-gray-300 dark:bg-transparent dark:ring-gray-700"
							>
								<option value="NEVER">Never</option>
								<option value="DAILY">Daily</option>
								<option value="WEEKLY">Weekly</option>
								<option value="MONTHLY">Monthly</option>
								<option value="YEARLY">Yearly</option>
							</select>
						</label>
					</div>

					<div class="md:col-span-3">
						<label class="mb-1 block text-sm text-gray-600 dark:text-gray-300"
							>Ends
							<div class="flex gap-2">
								<select
									bind:value={endsType}
									disabled={recurrence === 'NEVER'}
									class="w-full rounded-2xl px-4 py-3 ring-1 ring-gray-300 disabled:opacity-40 dark:bg-transparent dark:ring-gray-700"
								>
									<option value="NEVER">Never</option>
									<option value="ON">On date</option>
								</select>
								<input
									type="date"
									bind:value={endsOn}
									disabled={endsType !== 'ON'}
									class="w-full rounded-2xl px-3 py-3 ring-1 ring-gray-300 disabled:opacity-40 dark:bg-transparent dark:ring-gray-700"
								/>
							</div>
						</label>
					</div>

					<div class="md:col-span-4">
						<label class="mb-1 block text-sm text-gray-600 opacity-0"
							>Add Receipt
							<div class="flex items-center gap-3">
								<button
									type="button"
									onclick={pickReceipt}
									class="inline-flex w-full items-center justify-center rounded-2xl bg-gray-500 px-5 py-3 text-white hover:bg-gray-600 md:w-auto"
								>
									Add Receipt
								</button>
								{#if receiptFile}
									<div class="flex items-center gap-2 text-sm">
										<span class="max-w-[220px] truncate">{receiptFile.name}</span>
										<button
											type="button"
											class="text-red-600 hover:underline"
											onclick={clearReceipt}>remove</button
										>
									</div>
								{/if}
								<input
									class="hidden"
									bind:this={receiptInput}
									type="file"
									accept="image/*,application/pdf"
									onchange={onFileChange}
								/>
							</div>
						</label>
					</div>

					<div class="flex justify-end md:col-span-2">
						<button
							type="submit"
							class="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-3 text-white shadow hover:from-emerald-500 hover:to-green-600"
						>
							+ Add Transaction
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.box-transaction-expense {
		box-shadow:
			rgba(240, 46, 46, 0.4) 0px 5px,
			rgba(240, 46, 46, 0.3) 0px 10px,
			rgba(240, 46, 46, 0.2) 0px 15px,
			rgba(240, 46, 46, 0.1) 0px 20px,
			rgba(240, 46, 46, 0.05) 0px 25px;
	}
	.box-transaction-income {
		box-shadow:
			rgba(24, 234, 111, 0.721) 0px 5px,
			rgba(129, 239, 123, 0.336) 0px 10px,
			rgba(118, 242, 137, 0.258) 0px 15px,
			rgba(59, 242, 117, 0.396) 0px 20px,
			rgba(43, 192, 110, 0.311) 0px 25px;
	}
	.box-transaction {
		transition: box-shadow 180ms ease; /* optional: smooth change */
	}
</style>
