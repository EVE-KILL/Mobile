<script lang="ts">
    import { getUpstreamUrl } from '$lib/Config';
    import KillList from '../components/KillList.svelte';
    import Characters from '../components/TopBoxes/Characters.svelte';
    import Corporations from '../components/TopBoxes/Corporations.svelte';
    import Alliances from '../components/TopBoxes/Alliances.svelte';
    import Ships from '../components/TopBoxes/Ships.svelte';
    import Systems from '../components/TopBoxes/Systems.svelte';
    import Constellations from '../components/TopBoxes/Constellations.svelte';
    import Regions from '../components/TopBoxes/Regions.svelte';

    const upstreamUrl = getUpstreamUrl();
    const killListUrl = `${upstreamUrl}/api/killlist/latest`;
    const topCharactersUrl = `${upstreamUrl}/api/stats/topcharacters/10`;
    const topCorporationsUrl = `${upstreamUrl}/api/stats/topcorporations/10`;
    const topAlliancesUrl = `${upstreamUrl}/api/stats/topalliances/10`;
    const topShipsUrl = `${upstreamUrl}/api/stats/topships/10`;
    const topSystemsUrl = `${upstreamUrl}/api/stats/topsolarsystems/10`;
    const topConstellationsUrl = `${upstreamUrl}/api/stats/topconstellations/10`;
    const topRegionsUrl = `${upstreamUrl}/api/stats/topregions/10`;

    let activeTab = 'killmails';

    function setTab(tab) {
        activeTab = tab;
    }
</script>

<div class="container flex flex-col p-2 pt-4 gap-2">
    <!-- Tabs -->
    <div class="flex w-full space-x-4 pb-4 text-white">
        <button class={`tab-button ${activeTab === 'killmails' ? 'active' : ''}`} on:click={() => setTab('killmails')}>
            Killmails
        </button>
        <button class={`tab-button ${activeTab === 'top10' ? 'active' : ''}`} on:click={() => setTab('top10')}>
            Top 10
        </button>
    </div>

    <!-- Tab content -->
    {#if activeTab === 'killmails'}
        <div class="w-full">
            <KillList url={killListUrl} />
        </div>
    {/if}

    {#if activeTab === 'top10'}
        <div class="w-full grid grid-cols-2 gap-4">
            <div class="pb-5">
                <Characters url={topCharactersUrl} />
            </div>
            <div class="pb-5">
                <Corporations url={topCorporationsUrl} />
            </div>
            <div class="pb-5">
                <Alliances url={topAlliancesUrl} />
            </div>
            <div class="pb-5">
                <Ships url={topShipsUrl} />
            </div>
            <div class="pb-5">
                <Systems url={topSystemsUrl} />
            </div>
            <div class="pb-5">
                <Constellations url={topConstellationsUrl} />
            </div>
            <div class="pb-5">
                <Regions url={topRegionsUrl} />
            </div>
        </div>
    {/if}
</div>

<style>
    .tab-button {
        flex: 1; /* Ensure tabs take equal width */
        padding: 10px 0;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: background-color 0.3s;
        text-align: center;
    }

    .tab-button.active {
        background-color: rgba(255, 255, 255, 0.3);
        font-weight: bold;
    }

    .tab-button:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .grid-cols-2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .gap-4 {
        gap: 1rem;
    }

    .pb-5 {
        padding-bottom: 1.25rem;
    }
</style>
