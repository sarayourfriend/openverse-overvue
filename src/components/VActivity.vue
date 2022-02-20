<script setup lang="ts">
import { ref, watch } from "vue"
import VLastActivity from "./VLastActivity.vue"
import VFiInfo from "./VFiInfo.vue"
import VFiPR from "./VFiPR.vue"
import VFiCheck from "./VFiCheck.vue"
import VFiCross from "./VFiCross.vue"
import VLabels from "./VLabels.vue"
import { auth, hasAuth } from "../composables/auth"
import type { Activity } from "../composables/pulls"
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
</script>

<template>
	<li :class="[$style.activity, hasRead && $style.read]">
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
.activity {
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
