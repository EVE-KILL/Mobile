import * as client_hooks from '../../../src/hooks.client.ts';


export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23')
];

export const server_loads = [];

export const dictionary = {
		"/": [5],
		"/alliance/[id=number]": [~14],
		"/auth/eve/success": [10],
		"/battle/kill/[id=number]": [6],
		"/campaigns": [20],
		"/campaigns/[id]": [~21],
		"/character/[id=number]": [~12],
		"/corporation/[id=number]": [~22],
		"/docs/apidocs": [16],
		"/docs/stomp": [15],
		"/faq": [11],
		"/information": [8],
		"/item/[id=number]": [19],
		"/kills/[type=killlistTypes]": [13],
		"/kill/[id=number]": [~18],
		"/lists": [9],
		"/littlehelper": [7],
		"/search/[query]": [17],
		"/stats": [23]
	};

export const hooks = {
	handleError: client_hooks.handleError || (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';