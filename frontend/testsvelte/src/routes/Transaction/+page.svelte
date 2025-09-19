<script lang="ts">
    import logo from "$lib/assets/expenTrack_logo.svg";
    import TransactionCard from "$lib/components/TransactionCard.svelte";
    const symbolLeft = '<';
    const symbolRight = '>';
    let label = 'Date';
</script>

<div>
    <div class="flex justify-between mx-20 mt-10"> 
        <div class="flex items-center justify-center bg-gradient-to-b from-[#86D988] to-[#5AA698] rounded-xl"> <!--Add Transaction button-->
            <button name="Add Transaction" class="flex items-center justify-center p-3 font-mono font-semibold">
                + Add Transaction
            </button>
        </div>

        <div> <!--Date-->
            <div class="inline-flex gap-3 items-center ">
                <button class="size-8 flex disabled:opacity-30 rounded-2xl ring-1 items-center justify-center ring-black/10 pb-1">
                    {symbolLeft}
                </button>
                
                <div class="flex items-center gap-2 rounded-xl px-4 py-2 bg-white/70 ring-1 ring-black/10">
                    <span aria-hidden="true">
                        📅
                    </span>
                    <span class="font-mono items-center">
                        {label}
                    </span>
                </div>
                <button class="size-8 flex disabled:opacity-30 rounded-2xl ring-1 items-center justify-center ring-black/10 pb-1">
                    {symbolRight}
                </button>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-40 mt-10 mx-20">
        <TransactionCard title="Current Wallet Balance" value={300.00} format='currency' decimals={2} locale='en-GB' currency='THB' currencyDisplay='code' negative={false}></TransactionCard>
        <TransactionCard title="Total Peroid Expenses" value={300.00} format='currency' decimals={2} locale='en-GB' currency='THB' currencyDisplay='code' negative={false}></TransactionCard>
        <TransactionCard title="Total Peroid Income" value={300.00} format='currency' decimals={2} locale='en-GB' currency='THB' currencyDisplay='code' negative={false}></TransactionCard>
    </div>
</div>