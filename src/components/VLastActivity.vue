<script setup lang="ts">
import type { Activity } from "../composables/pulls"
import { relativeTime } from "../utils/relative-time"

defineProps<{ activity: Activity }>()
</script>

<template>
	<p v-if="activity.lastActivity.user">
		Last activity by
		<a :href="activity.lastActivity.user.html_url">{{
			activity.lastActivity.user.login
		}}</a>
		{{ " " }}
		<a :href="activity.lastActivity.html_url"
			>{{ relativeTime(activity.lastActivity.updated_at) }} ago</a
		>
	</p>
</template>
