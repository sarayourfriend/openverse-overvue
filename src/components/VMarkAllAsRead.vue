<script setup lang="ts">
import { ref } from "vue"
import { allActivities } from "../composables/pulls"
import { markAsRead, hasRead } from "../composables/read"

const isCaughtUp = ref(allActivities().map(hasRead).some(Boolean))

const markAllAsRead = () => {
	markAsRead(allActivities())
	isCaughtUp.value = true
}
</script>

<template>
	<div v-if="isCaughtUp">You're all caught up!</div>
	<button v-else @click.prevent="markAllAsRead" type="button">
		Mark all as read
	</button>
</template>
