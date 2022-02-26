<script setup lang="ts">
import { computed } from "vue"
import { filterList, toggleFilter } from "../composables/filters"
import { overdueFilter } from "../utils/filters"

const isOverdueFiltered = computed(() =>
	filterList.value.includes(overdueFilter),
)

const toggleOverdueFilter = () => toggleFilter(overdueFilter)
</script>

<template>
	<button @click.prevent="toggleOverdueFilter" type="button">
		{{ isOverdueFiltered ? "Show all activity" : "Show overdue PRs" }}
	</button>
</template>
