<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { tick, onMount } from 'svelte';
	import LoginFrame from "$lib/assets/loginFrame.png";
	import SignUpFrame from "$lib/assets/signup_frame.svg";
	import { goto } from '$app/navigation';

	let firstField: HTMLInputElement | null = null;
	let overlay: HTMLDivElement | null = $state(null);

	let email:string= $state("");
	let password:string = $state("");
	let Confirmpassword:string = $state('');
	let name :string= $state('');
	async function handleSubmitlogin() {
		alert(`Email: ${email}\nPassword: ${password}`);//check bind value for dev
		let postdata = {
			email: email,
			password: password,
		};
		const response = await fetch('http://localhost:3000/auth/login', {//naja
			method: 'POST',
			headers: {
				"Content-Type": "application/json",   // <-- tell server this is JSON
			},
			body: JSON.stringify(postdata)
		});
		console.log("Sending to API:", { email, password });
		console.log(JSON.stringify(postdata));
		if (response.ok) {
		alert('Form submitted successfully!');
		navigateToHome();//naja
		login();
		// Optionally clear form fields or redirect
		} else {
		alert('Error submitting form.');
			const textBody: string = await response.text();
			alert(textBody);
		}
	}

	async function handleSubmitsignup() {
		alert(`Email: ${email}\nPassword: ${password}`);//check bind value
		let postdata = {
			email: email,
			password: password,
			confirmpassword: Confirmpassword,
			name: name
		};
		const response = await fetch('http://localhost:3000/auth/register', {//naja
			method: 'POST',
			headers: {
				"Content-Type": "application/json",   // <-- tell server this is JSON
			},
			body: JSON.stringify(postdata),
		});
		if (response.ok) {
		alert('Form submitted successfully!');
		navigateToHome();//naja
		login();
		// Optionally clear form fields or redirect
		} else {
			const textBody: string = await response.text();
			console.log("Response text:", textBody);
			alert(textBody);
		}
	}

	let {
		open = false,
		mode = 'login',
		login = () => {},
		signup = () => {},
		onClose = () => {}
	} = $props();

	function navigateToHome() {
		event?.preventDefault();
        goto('home');
    }
	
	function close() {
		onClose();
	}

	function Clicklogin() {
		navigateToHome();//naja
		login();
	}

	function Clicksignup() {
		navigateToHome(); //naja
			signup();
	}

	function clickBackDrop(e: MouseEvent) {
		console.log(e.target);
		if (e.target === e.currentTarget) {
			close();
		}
	}


	function passwordhide() {
		var password = document.getElementById('password');
		var confirm_password = document.getElementById('confirm_password');
		if (confirm_password != null) {
			if (confirm_password.type == 'text') {
				confirm_password.type = 'password';
			} else {
				confirm_password.type = 'text';
			}
		}
		if (password.type == 'text') {
			password.type = 'password';
		} else {
			password.type = 'text';
		}
	}

	function Passwordmatch(): boolean {
		var password = document.getElementById('password') as HTMLInputElement;
		var confirm_password = document.getElementById('confirm_password') as HTMLInputElement;
		var validation = document.getElementById('validation') as HTMLParagraphElement;
		if (confirm_password != null) {
			if (password.value != confirm_password.value) {
				validation.textContent = 'Password not match!';
				return false;
			} else {
				validation.textContent = '';
				return true;
			}
		}
		return true;
	}
</script>

<svelte:window on:keydown={(e) => open && e.key === 'Escape' && close()} />
{#if open}
	<!-- Backdrop + blur -->
	<div
		bind:this={overlay}
		tabindex="-1"
		class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
		transition:fade={{ duration: 100 }}
	></div>

	<!-- Modal login/sign up -->
	<div
		class="h-md max-h-md fixed inset-0 z-50 flex items-center justify-center overflow-auto pb-4 pt-4"
		onclick={clickBackDrop}
		aria-hidden="true"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="auth-title"
			class="h-full w-full max-w-md overflow-auto rounded-2xl bg-[#FFF8EF] shadow-xl ring-1 ring-black/5 bg-no-repeat bg-[length:460px_500px] bg-top"
			transition:scale={{ duration: 160, start: 0.8 }} style="background-image: url('{LoginFrame}');"
		>	
            <div style="margin-top: 30%;"></div>
			{#if mode === 'login'}
				<!-- title -->
				<p class="head-text-shadow text-center text-6xl font-black text-gray-900">LOG IN</p>
				<div style="margin-top: 20%;"></div>
				<!-- form -->
				<form class="mx-auto max-w-sm" onsubmit={handleSubmitlogin} id="loginform">
					<div class="mb-5">
						<label for="email" class="normal-text mb-2 block text-sm font-medium text-gray-900">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="name@flowbite.com"
							required
						/>
						<label for="password" class="normal-text mb-2 block text-sm font-medium text-gray-900"
							>Your password</label
						>
						<input
							type="password"
							placeholder="password"
							name=""
							id="password"
							bind:value={password}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required
						/>
						<div style="margin-top:15px;"></div>
						<div class="flex items-center">
							<input
								checked
								id="checked-checkbox"
								type="checkbox"
								onclick={passwordhide}
								value=""
								class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="checked-checkbox" class="normal-text ms-2 text-sm font-medium text-gray-900"
								>Hide password</label
							>
						</div>
					</div>
					<div class="mb-5 flex flex-col items-center">
						<button
							type="submit"
							class="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
						>
							<!-- for Show naja -->
							<span
								class="relative rounded-md bg-white px-20 py-2.5 font-bold transition-all duration-75 ease-in group-hover:bg-transparent dark:bg-gray-900 group-hover:dark:bg-transparent"
							>
								LOG IN
							</span>
						</button>
						<p class="text-1xl font-thin text-gray-900" style="margin-top: 15px;">OR</p>
						<div class="mt-7 flex flex-col gap-2" style="margin-top: 15px;">
							<button
								onclick={Clicklogin}
								class="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
								><img
									src="https://www.svgrepo.com/show/475656/google-color.svg"
									alt="Google"
									class="h-[18px] w-[18px]"
								/>Continue with Google
							</button>
						</div>
					</div>
				</form>
			{:else if mode === 'signup'}
				<p class="head-text-shadow text-center text-6xl font-black text-gray-900">SIGN UP</p>
				<div style="margin-top: 20%;"></div>
				<!-- form -->
				<form class="mx-auto max-w-sm" id="signupform" onsubmit={() => (Passwordmatch()) ? handleSubmitsignup() : alert('Password still not match!')}>
					<div class="mb-5">
						<label for="email" class="mb-2 block text-sm font-medium text-gray-900">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="name@flowbite.com"
							required
						/>
						<label
							for="email"
							class="normal-text mb-2 block text-sm font-medium text-gray-900"
							style="margin-top: 10px;">Username</label
						>
						<input
							type="text"
							id="username"
							bind:value={name}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Username..."
							required
						/>
						<label
							for="password"
							class="normal-text mb-2 block text-sm font-medium text-gray-900"
							style="margin-top: 10px;">Password</label
						>
						<input
							type="password"
							placeholder="password"
							name="password"
							id="password"
							bind:value={password}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required
						/>
						<label
							for="password"
							class="normal-text mb-2 block text-sm font-medium text-gray-900"
							style="margin-top: 10px;">Confirm Password</label
						>
						<input
							type="password"
							placeholder="Confirm your password"
							name="confirm_password"
							id="confirm_password"
							onkeyup={Passwordmatch}
							bind:value={Confirmpassword}
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							required
						/>
						<p id="validation" class="text-center text-sm bold text-red-500" style="margin-top: 15px;"></p>
						<div style="margin-top:15px;"></div>
						<div class="flex items-center">
							<input
								checked
								id="checked-checkbox"
								type="checkbox"
								onclick={passwordhide}
								value=""
								class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="checked-checkbox" class="normal-text ms-2 text-sm font-medium text-gray-900"
								>Hide password</label
							>
						</div>
					</div>
					<div class="mb-5 flex flex-col items-center">
						<button
							type="submit"
							class="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800"
						>
							<!-- for Show naja -->
							<span
								class="relative rounded-md bg-white px-20 py-2.5 transition-all duration-75 ease-in group-hover:bg-transparent dark:bg-gray-900 group-hover:dark:bg-transparent"
							>
								Sign up
							</span>
						</button>
						<!-- <p class="text-1xl font-thin text-gray-900" style="margin-top: 15px;">OR</p>
						<div class="mt-7 flex flex-col gap-2" style="margin-top: 15px;">
							<button
							class="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"><img
								src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"
								class="h-[18px] w-[18px] ">Continue with
							Google
						</button>
						</div> -->
					</div>
				</form>
			{/if}
		</div>
	</div>
{/if}
