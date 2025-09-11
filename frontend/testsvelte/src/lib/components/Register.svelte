<script lang="ts">
	//import database
	let showPassword = false;
	$: password = showPassword ? 'text' : 'password';
</script>

<div
	class="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-800"
>
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
				Login
			</h2>
		</div>
		<form action="?/Login" method="POST" class="mt-8 space-y-6">
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="username" class="sr-only">Username</label>
					<input id="username" name="username" type="text" required placeholder="Username" />
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input id="password" name="password" type={password} required placeholder="Password" />
				</div>
				<div class="flex items-center py-5">
					<input
						type="checkbox"
						bind:checked={showPassword}
						id="showPassword"
						class="form-checkbox h-5 w-5 text-indigo-600"
					/>
					<label
						for="showPassword"
						class="ml-2 text-sm text-gray-700 hover:cursor-pointer dark:text-gray-200"
					>
						Show Password
					</label>
				</div>
			</div>

			<!-- {#if usernameTaken}
                <p class="error">Username is taken.</p>
            {/if} -->

			<div>
				<button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-700 dark:hover:bg-indigo-800 dark:focus:ring-indigo-700"
				>
					Login
				</button>
			</div>
		</form>
	</div>
</div>
