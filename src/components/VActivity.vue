<script setup lang="ts">
import { ref, watch } from "vue"
import VLastActivity from "./VLastActivity.vue"
import VFiInfo from "./VFiInfo.vue"
import VFiPR from "./VFiPR.vue"
import VFiCheck from "./VFiCheck.vue"
import VFiCross from "./VFiCross.vue"
import VLabels from "./VLabels.vue"
import { auth, hasAuth } from "../composables/auth"
import { Activity, useIsFiltered, hasFilters } from "../composables/pulls"
import { relativeTime } from "../utils/relative-time"
import { hasRead as checkHasRead, markAsRead, read } from "../composables/read"

const props = defineProps<{ activity: Activity }>()
const hasRead = ref(checkHasRead(props.activity))
watch([read], () => {
	hasRead.value = checkHasRead(props.activity)
})
const isPull = "pull_request" in props.activity
const isClosed = typeof props.activity.closed_at === "string"
const isMerged = typeof props.activity.pull_request?.merged_at === "string"
const IconComponent = isPull
	? isClosed
		? VFiCross
		: isMerged
		? VFiCheck
		: VFiPR
	: /* issue */ isClosed
	? VFiCheck
	: VFiInfo

const isFiltered = useIsFiltered(props.activity)
</script>

<template>
	<li
		:class="[
			$style.activity,
			hasFilters ? $style.hideableActivity : $style.activity,
			hasRead && $style.read,
			!isFiltered && $style.hidden,
		]"
	>
		<div :class="$style.actions">
			<IconComponent :class="$style.icon" />
			<button
				aria-label="Mark as read"
				@click.prevent="markAsRead([activity])"
				type="button"
				:disabled="hasRead"
				:class="$style.markAsRead"
			>
				☑️
			</button>
		</div>
		<div>
			<a :class="$style.title" :href="activity.html_url">{{
				activity.title
			}}</a>
			<p :class="$style.small" v-if="activity.user">
				Opened by
				<a :href="activity.user.html_url">{{ activity.user.login }}</a>
				{{ relativeTime(activity.created_at) }} ago
			</p>
			<VLastActivity
				v-if="hasAuth(auth)"
				:class="$style.small"
				:activity="activity"
			/>
			<VLabels
				v-if="activity.labels.length"
				:activity="activity"
				:class="$style.small"
			/>
		</div>
	</li>
</template>

<style module>
.activity,
.hideableActivity {
	border-bottom: 1px solid var(--text);
	width: 100%;
	padding: 1rem;
	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	align-items: center;
}

.activity:first-of-type {
	border-top: 1px solid var(--text);
}

.activity:last-of-type {
	border-bottom: none;
}

.hidden {
	display: none;
}

.hideableActivity:not(.hidden) {
	border-top: 1px solid var(--text);
	border-bottom: 1px solid var(--text);
}

.hideableActivity:not(.hidden) ~ .hideableActivity {
	border-top: 1px solid var(--text);
}

.hideableActivity:not(.hidden) ~ .hideableActivity:not(.hidden) {
	border-top: none;
	border-bottom: none;
}

.hideableActivity ~ .hideableActivity:not(.hidden) {
	border-bottom: 1px solid var(--text);
}

.actions {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 1rem;
}

.icon {
	width: 1.25rem;
	height: 1.25rem;
}

.markAsRead {
	margin-top: 0.5rem;
}

.read {
	opacity: 75%;
}

.title {
	-webkit-appearance: none;
	background-color: transparent;
	border: none;
}

.small {
	font-size: 0.75rem;
}
</style>
