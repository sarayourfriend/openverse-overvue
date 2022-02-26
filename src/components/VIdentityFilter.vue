<script setup lang="ts">
import { computed } from "vue"
import { filterList, toggleFilter } from "../composables/filters"
import { identity } from "../composables/auth"
import { identityFilter } from "../utils/filters"

const isIdentityFiltered = computed(() =>
	filterList.value.includes(identityFilter),
)

const hasIdentity = computed(() => identity.value !== null)

const toggleIdentityFilter = () => toggleFilter(identityFilter)
</script>

<template>
	<button
		v-if="hasIdentity"
		@click.prevent="toggleIdentityFilter"
		type="button"
	>
		{{ isIdentityFiltered ? "Show all activity" : "Show requested reviews" }}
	</button>
</template>
