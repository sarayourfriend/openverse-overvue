<script setup lang="ts">
import type { Activity } from "../composables/pulls"
import { relativeTime } from "../utils/relative-time"
import { getLastActivity } from "../utils/last-activity"

const props = defineProps<{ activity: Activity }>()
const lastActivity = getLastActivity(props.activity)
</script>

<template>
	<p v-if="lastActivity.user">
		Last activity by
		<a :href="lastActivity.user.html_url">{{ lastActivity.user.login }}</a>
		{{ " " }}
		<a :href="lastActivity.html_url"
			>{{ relativeTime(lastActivity.updated_at) }} ago</a
		>
	</p>
</template>
