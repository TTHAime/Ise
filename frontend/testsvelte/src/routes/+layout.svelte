<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/expenTrack_logo.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Auth from '$lib/components/auth.svelte';
	import { goto, onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let authShow = $state(false);
	let mode = $state('login');
	let user = $state<user | null>(null);

	async function login() {
		// call API
		authShow = false;
		goto('/home');
	}

	async function signup() {
		// call API
		authShow = false;
	}

	const openLogin = () => {
		mode = 'login';
		authShow = true;
	};
	const openSignUp = () => {
		mode = 'signup';
		authShow = true;
	};

	const closeAuth = () => {
		authShow = false;
	};
	const logout = () => {
		user = null;
		goto('/');
	};

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>
<div class="mybackground flex min-h-screen flex-col">
	<Navbar {user} loginClick={openLogin} signupClick={openSignUp} logoutClick={logout}></Navbar>

	<Auth open={authShow} {mode} {login} {signup} onClose={closeAuth}></Auth>

	{@render children?.()}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}

	:root::view-transition-old(root) {
		animation:
			90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	:root::view-transition-new(root) {
		animation:
			210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}
</style>
