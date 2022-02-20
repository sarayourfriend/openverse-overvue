<script setup lang="ts">
import type { Activity } from "../composables/pulls"

defineProps<{ activity: Activity }>()
</script>

<template>
	<ul>
		<li v-for="label in activity.labels">{{ label.name }}</li>
	</ul>
</template>
