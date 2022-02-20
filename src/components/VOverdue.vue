<script setup lang="ts">
import { computed } from "vue"
import { filterList } from "../composables/pulls"
import { overdueFilter } from "../utils/filters"

const isFiltered = computed(() => filterList.value.includes(overdueFilter))

const toggleFilter = () =>
	(filterList.value = isFiltered.value ? [] : [overdueFilter])
</script>

<template>
	<button @click.prevent="toggleFilter" type="button">
		{{ isFiltered ? "Show all activity" : "Show overdue PRs" }}
	</button>
</template>
