<script setup lang="ts">
import VListAggregator from "./components/VListAggregator.vue"
import VMarkAllAsRead from "./components/VMarkAllAsRead.vue"
import VGitHubAuth from "./components/VGitHubAuth.vue"
import VOverdue from "./components/VOverdue.vue"
</script>

<template>
	<h1 :class="$style.title">Openverse Project Overview</h1>
	<div :class="$style.copy">
		<div :class="$style.auth">
			<VGitHubAuth />
		</div>
		<VMarkAllAsRead />
		<VOverdue />
	</div>
	<VListAggregator />
</template>

<style module>
.title {
	padding-top: 2rem;
	font-weight: bold;
	font-size: 2rem;
	width: 100%;
	text-align: center;
	padding-bottom: 2rem;
}

.copy {
	width: 75vw;
	min-width: 300px;
	margin: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.auth {
	margin-bottom: 1rem;
}
</style>
