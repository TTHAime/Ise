<script lang="ts">
	import '../app.css';
	import logo from "$lib/assets/expenTrack_logo.svg";
	import Navbar from '$lib/components/Navbar.svelte';
	import Auth from "$lib/components/auth.svelte";

	//Just test before Use API
	type user = {
		id: Number;
		name: String;
	}

    let authShow = $state(false);
    let mode = $state('login');
	let user = $state<user | null>(null);

	async function login() {
		// call API
		user = {id : 1, name : 'Time'};
		authShow = false;
	}

	async function signup() {
		// call API
		user = {id : 1, name : 'Captain'};
		authShow = false;
	}

	const openLogin = () => {mode = 'login'; authShow = true;};
	const openSignUp = () => {mode = 'signup'; authShow = true};
	const closeAuth = () => {authShow = false;};
	const logout = () => {user = null;};

	$effect(() => {
		console.log(authShow);
	});

	let { children } = $props();
</script>

<style lang="postcss">
	@reference "tailwindcss";
</style>
<svelte:head>
	<link rel="icon" href={logo} />
</svelte:head>
<div class="mybackground flex min-h-screen flex-col">
<Navbar user={user} loginClick={openLogin} signupClick={openSignUp} logoutClick={logout}></Navbar>

<Auth open={authShow} mode={mode} login={login} signup={signup} onClose={closeAuth}> </Auth>

{@render children?.()}

</div>
