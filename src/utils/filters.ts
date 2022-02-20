import type { Activity } from "../composables/pulls"
import { getFormatOptions } from "./relative-time"

export type Filter = Readonly<{
	type: "priority"
	test: (a: Activity) => boolean
}>

export const overdueFilter = Object.freeze({
	type: "priority",
	test: (a) => {
		if (!("pull_request" in a)) return false

		const [value, unit] = getFormatOptions(
			new Date(Date.now()).valueOf() -
				new Date(a.lastActivity.updated_at).valueOf(),
		)
		if (!unit.startsWith("day")) return false

		switch (a.priority) {
			case "critical": {
				return true
			}
			case "high": {
				return value >= 2
			}
			case "medium": {
				return value >= 3
			}
			case "low": {
				return value >= 5
			}
			case null: {
				return false
			}
		}
	},
}) as Filter
