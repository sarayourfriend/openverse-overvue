import { ref, computed } from "vue"
import type { Activity } from "./pulls"
import type { Filter } from "../utils/filters"

export const filterList = ref([] as Filter[])
export const hasFilters = computed(() => Boolean(filterList.value.length))

export const isFiltered = (a: Activity): boolean =>
	filterList.value.length === 0 || filterList.value.some((f) => f.test(a))

export const useIsFiltered = (a: Activity) => computed(() => isFiltered(a))

export const toggleFilter = (filter: Filter) => {
	if (filterList.value.includes(filter)) {
		filterList.value = filterList.value.filter((f) => f !== filter)
	} else {
		filterList.value = [...filterList.value, filter]
	}
}
