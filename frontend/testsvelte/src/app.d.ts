// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				username: string;
				password: string;
				email: string;
			} | null;
		}
		interface PageData {
			user: {
				id: string;
				name: string;
			} | null;
		}
		interface Error {
			message: string;
			code?: number;
		}
		interface PageState {
			isDarkMode: boolean;
		}
		// interface Platform {}
	}
}

export {};
