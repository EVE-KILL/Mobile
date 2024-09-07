<script lang="ts">
    import type { Killmail } from '../types/Killmail';
    import { onMount } from 'svelte';
    import { formatNumber, convertIskToBillions, convertIskToMillions } from '$lib/Helpers';
    import { fetchKillList } from '$lib/fetchKillList.ts';
    import { goto } from '$app/navigation';

    export let url: string;
    export let title: string = '';

    let kills: Killmail[] = [];
    let page: number = 1;
    let loading: boolean = false;
    let longPressMenu = { visible: false, x: 0, y: 0, killmailId: '', victim: null, attacker: null };
    let pressTimeout: any;
    // Menu width is 56 * 4 = 224px
    const menuWidth = 224;

    // Coordinates to detect scroll movement
    let startX: number = 0;
    let startY: number = 0;

    onMount(() => {
        loadKills();
        // Close long press menu if the user starts scrolling or touches elsewhere
        window.addEventListener('scroll', closeLongPressMenu);
        window.addEventListener('touchstart', closeLongPressMenu);
    });

    function closeLongPressMenu() {
        longPressMenu.visible = false;
    }

    async function loadKills() {
        if (loading) return;
        loading = true;
        const newKills: Killmail[] = await fetchKillList(url, page);
        kills = newKills.slice(0, 100);
        updateURL();
        loading = false;
    }

    function changePage(newPage: number) {
        if (newPage > 0) {
            page = newPage;
            loadKills();
        }
    }

    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('killlistPage', String(page));
        goto(newUrl.toString(), { replaceState: true });
    }

    function handleClick(event: MouseEvent, killmailId: string) {
        if (event.ctrlKey || event.metaKey || event.button === 1) {
            event.preventDefault();
            window.open(`/kill/${killmailId}`, '_blank');
        } else {
            window.location.href = `/kill/${killmailId}`;
        }
    }

    function handleLongPressStart(event: TouchEvent, killmail: Killmail) {
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;

        pressTimeout = setTimeout(() => {
            const touch = event.touches[0];
            const attacker = killmail.attackers.find(attacker => attacker.final_blow);

            // Get the viewport width
            const viewportWidth = window.innerWidth;

            // Calculate the x position, ensuring it fits within the viewport
            let xPos = touch.pageX;
            if (xPos + menuWidth > viewportWidth) {
                xPos = viewportWidth - menuWidth;
            }

            longPressMenu = {
                visible: true,
                x: xPos,
                y: touch.pageY,
                killmailId: killmail.killmail_id,
                victim: killmail.victim,
                attacker
            };
        }, 250);
    }

    function handleTouchMove(event: TouchEvent) {
        const touch = event.touches[0];
        const deltaX = Math.abs(touch.clientX - startX);
        const deltaY = Math.abs(touch.clientY - startY);

        // Cancel the long press if there's movement (indicating scrolling)
        if (deltaX > 10 || deltaY > 10) {
            clearTimeout(pressTimeout);
        }
    }

    function handleLongPressEnd() {
        clearTimeout(pressTimeout);
    }

    function openInNewWindow(killmailId: string) {
        window.open(`/kill/${killmailId}`, '_blank');
        longPressMenu.visible = false;
    }

    function handleMenuClick(event: MouseEvent | TouchEvent) {
        event.stopPropagation(); // Prevent click/touch events from reaching underlying elements
    }

    // Parse kill time and calculate the difference in minutes
    function getMinutesSinceKill(killTime: string): string {
        const killDate = new Date(`${killTime}Z`);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - killDate.getTime()) / 60000);
        return diffInMinutes > 99 ? '>99m' : `${diffInMinutes}m`;
    }
</script>

{#if title !== undefined}
    <h1 class="text-white">{title}</h1>
{/if}

<!-- Long press context menu -->
{#if longPressMenu.visible}
    <div
        class="absolute z-50 bg-gray-800 text-white rounded shadow-lg p-2 w-56"
        style="top: {longPressMenu.y}px; left: {longPressMenu.x}px;"
        on:click={handleMenuClick} on:touchstart={handleMenuClick} on:touchend={handleMenuClick}
    >
        <button
            class="block w-full px-4 py-2 text-sm hover:bg-gray-700"
            on:click={() => openInNewWindow(longPressMenu.killmailId)}
        >
            Open Kill in New Window
        </button>

        <div class="mt-2">
            <span class="font-bold">Victim</span>
            <a href={`/character/${longPressMenu.victim.character_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                Character
            </a>
            <a href={`/corporation/${longPressMenu.victim.corporation_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                Corporation
            </a>
            {#if longPressMenu.victim.alliance_id}
                <a href={`/alliance/${longPressMenu.victim.alliance_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                    Alliance
                </a>
            {/if}
        </div>

        {#if longPressMenu.attacker}
            <div class="mt-2">
                <span class="font-bold">Final Blow</span>
                <a href={`/character/${longPressMenu.attacker.character_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                    Character
                </a>
                <a href={`/corporation/${longPressMenu.attacker.corporation_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                    Corporation
                </a>
                {#if longPressMenu.attacker.alliance_id}
                    <a href={`/alliance/${longPressMenu.attacker.alliance_id}`} target="_blank" class="block w-full px-4 py-2 text-sm hover:bg-gray-700" on:click={handleMenuClick}>
                        Alliance
                    </a>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<!-- Pagination Control at the Top -->
<div class="flex justify-between items-center mb-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>

<!-- Kill List Table -->
<div class="overflow-x-auto" role="table">
    <table class="table-auto min-w-full bg-semi-transparent bg-gray-800 rounded-lg shadow-lg">
        <thead>
            <tr class="bg-darker text-white uppercase text-xs leading-normal">
                <th class="px-2 py-1 w-[64px]" scope="col"></th>
                <th class="px-2 py-1" scope="col">Victim</th>
            </tr>
        </thead>

        <tbody class="text-gray-300 text-sm">
            {#each kills as kill (kill.killmail_id)}
                <tr
                    class="relative border-b border-gray-700 hover:bg-gray-600 transition-colors duration-300 cursor-pointer"
                    on:mousedown={(event) => handleClick(event, kill.killmail_id)}
                    on:touchstart={(event) => handleLongPressStart(event, kill)}
                    on:touchmove={handleTouchMove}
                    on:touchend={handleLongPressEnd}
                >
                    <!-- Character Image -->
                    <td class="py-1">
                        <img
                            src="{kill.victim.character_image_url}?size=128"
                            alt="Character: {kill.victim.character_name}"
                            class="w-12 min-w-12 rounded"
                        />
                    </td>

                    <!-- Victim's Character Name, Corporation, Location, and Ship -->
                    <td class="py-1 relative">
                        <div class="flex items-center space-x-2">
                            <div class="flex flex-col items-center">
                                <!-- Corporation Image (half size) -->
                                <img
                                    src="{kill.victim.corporation_image_url}?size=64"
                                    alt="Corporation: {kill.victim.corporation_name}"
                                    class="w-6 min-w-6 rounded"
                                />
                                <!-- Victim Ship Image -->
                                <img
                                    src="{kill.victim.ship_image_url}?size=64"
                                    alt="Ship: {kill.victim.ship_name}"
                                    class="w-6 min-w-6 mt-1 rounded"
                                />
                            </div>
                            <div>
                                <span>{kill.victim.character_name}</span><br />
                                <span class="text-gray-400">{kill.victim.corporation_name}</span><br />
                                <span class="text-gray-500">{kill.region_name} / {kill.system_name}</span>
                            </div>
                        </div>

                        <!-- Total value in ISK and time since kill (positioned absolutely within the relative td) -->
                        <div class="absolute top-0 right-0 text-gray-400 text-xs text-right px-2 py-1">
                            {#if kill.total_value >= 1_000_000_000}
                                <span>{convertIskToBillions(kill.total_value)}</span><br />
                            {:else}
                                <span>{convertIskToMillions(kill.total_value)}</span><br />
                            {/if}
                            <span>{getMinutesSinceKill(kill.kill_time)}</span>
                        </div>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- Pagination Control at the Bottom -->
<div class="flex justify-between items-center mt-4">
    <button
        on:click={() => changePage(page - 1)}
        disabled={page === 1 || loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Previous
    </button>
    <span class="text-white">Page {page}</span>
    <button
        on:click={() => changePage(page + 1)}
        disabled={loading}
        class="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50"
    >
        Next
    </button>
</div>

<style>
    .w-12 {
        width: 3rem;
    }

    .w-6 {
        width: 1.5rem;
    }

    .min-w-12 {
        min-width: 3rem;
    }

    .min-w-6 {
        min-width: 1.5rem;
    }

    .relative {
        position: relative;
    }
</style>
