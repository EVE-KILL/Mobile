<script lang="ts">
    let showMenu = false;
    let showSearch = false;

    function toggleMenu() {
        showMenu = !showMenu;
    }

    function closeMenu() {
        showMenu = false;
    }

    function openSearch() {
        showSearch = true;
    }

    function closeSearch() {
        showSearch = false;
    }

    // Close menu when clicking outside of it
    function closeMenuOutside(event: MouseEvent) {
        if ((event.target as HTMLElement).closest('.menu-container')) {
            return;
        }
        closeMenu();
    }
</script>

<!-- Navbar -->
<nav class="bg-transparent p-2 flex justify-between items-center text-white relative z-20">
    <!-- Menu button (left) -->
    <div class="flex items-center">
        <button class="p-2" on:click={toggleMenu}>
            ☰
        </button>
    </div>

    <!-- Site logo / title (center) -->
    <div class="absolute left-1/2 transform -translate-x-1/2">
        <a href="/" class="text-xl font-bold">EVE-KILL</a>
    </div>

    <!-- Search button (right) -->
    <div class="flex items-center">
        <button class="p-2" on:click={openSearch}>
            🔍
        </button>
    </div>
</nav>

<!-- Side menu -->
{#if showMenu}
    <div class="fixed inset-0 z-30" on:click={closeMenuOutside}>
        <div class="menu-container fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg z-40">
            <div class="p-4 text-white">
                <button class="text-red-500 mb-4" on:click={closeMenu}>✕ Close</button>
                <ul class="space-y-2">
                    <li><a href="/link1" class="block">Link 1</a></li>
                    <li><a href="/link2" class="block">Link 2</a></li>
                    <li><a href="/link3" class="block">Link 3</a></li>
                </ul>
            </div>
        </div>
    </div>
{/if}

<!-- Full-screen search -->
{#if showSearch}
    <div class="fixed inset-0 bg-gray-900 flex justify-center items-start z-50 p-4">
        <div class="w-full max-w-md relative">
            <!-- Close button (X) at the top-right -->
            <button class="absolute top-0 right-0 p-2 text-white" on:click={closeSearch}>
                ✕
            </button>

            <!-- Search input field -->
            <input type="text" placeholder="Search..." class="w-full p-4 text-black bg-white rounded-lg mt-8" autofocus>
        </div>
    </div>
{/if}

<style>
    nav {
        position: relative;
        z-index: 20;
    }

    /* Ensure the side menu has the highest z-index */
    .menu-container {
        z-index: 40;
    }

    /* Full-screen search */
    .inset-0 {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .z-30 {
        z-index: 30;
    }
    .z-40 {
        z-index: 40;
    }
    .z-50 {
        z-index: 50;
    }

    /* Close button styling */
    button {
        cursor: pointer;
    }
</style>
