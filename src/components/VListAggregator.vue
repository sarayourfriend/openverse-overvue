<script setup lang="ts">
import VActivity from "./VActivity.vue"
import { activityList } from "../composables/pulls"
</script>

<template>
	<div :class="$style.container">
		<div
			:class="$style.pulls"
			v-for="(activities, repo) in activityList"
			:key="repo"
		>
			<h3 :class="$style.title">
				<a
					:class="$style.titleLink"
					:href="`https://github.com/WordPress/${repo}`"
					target="_blank"
					rel="noopener noreferrer"
					>WordPress/{{ repo }}</a
				>
			</h3>
			<ul>
				<VActivity
					v-for="activity in activities"
					:key="activity.id"
					:activity="activity"
				/>
			</ul>
		</div>
	</div>
</template>

<style module>
.container {
	padding: 1rem;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	overflow-x: scroll;
	overflow-y: hidden;
}

.title {
	text-align: center;
	padding: 1rem 1rem;
	white-space: nowrap;
}

.titleLink {
	color: var(--accent);
	font-weight: bold;
	transition: color;
	transition-duration: 0.2s;
}

.titleLink:visited,
.titleLink:hover,
.titleLink:focus-visible {
	color: var(--accent-active);
}

.pulls {
	border: 1.5px solid var(--text);
	min-width: min-content;
	background-color: var(--background-contrast);
}

.pulls:not(:last-of-type) {
	border-right: none;
}

.pulls:first-of-type {
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

.pulls:last-of-type {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
</style>
