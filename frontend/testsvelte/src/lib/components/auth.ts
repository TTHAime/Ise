import {writable} from 'svelte/store';

export const user = writable(null);

export async function refreshUser() {
   try{
		const url = 'http://localhost:4000/user/'
		const response = await fetch(url, {
			credentials : 'include'
		});
		user.set(response.ok? await response.json() : null);
	}catch{
		user.set(null);
	}
}

export async function logout() {
    try{
		const api : string = 'http://localhost:4000/auth/logout';
		const response = await fetch(api, {credentials : 'include'});
		if(response.ok){
            user.set(null);
			console.log('Logout successfully.(from auth.ts)');
		}else{
			console.log(`Log out failed with status : ${response.status}`);
		}
	}catch(e){
		alert(`An error occured during logout : ${e}`); //Only dev
	}
}