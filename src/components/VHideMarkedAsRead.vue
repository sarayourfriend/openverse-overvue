<script setup lang="ts">
import { toggleHidingRead, hideRead } from "../composables/hide-read"
</script>

<template>
	<button @click.prevent="toggleHidingRead" type="button">
		{{ hideRead ? "Show" : "Hide" }} read activities
	</button>
</template>
