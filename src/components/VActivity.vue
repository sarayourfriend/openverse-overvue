<script setup lang="ts">
import { ref, watch } from "vue"
import VLastActivity from "./VLastActivity.vue"
import { auth, hasAuth } from "../composables/auth"
import type { Activity } from "../composables/pulls"
import { relativeTime } from "../utils/relative-time"
import { hasRead as checkHasRead, markAsRead, read } from "../composables/read"

const props = defineProps<{ activity: Activity }>()
const hasRead = ref(checkHasRead(props.activity))
watch([read], () => {
	hasRead.value = checkHasRead(props.activity)
})
</script>

<template>
	<li :class="[$style.activity, hasRead && $style.read]">
		<button
			aria-label="Mark as read"
			@click.prevent="markAsRead([activity])"
			type="button"
			:disabled="hasRead"
			:class="$style.markAsRead"
		>
			☑️
		</button>
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

.markAsRead {
	margin-right: 1rem;
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
