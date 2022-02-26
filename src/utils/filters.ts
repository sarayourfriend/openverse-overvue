import type { Activity } from "../composables/pulls"
import { identity } from "../composables/auth"
import { getFormatOptions } from "./relative-time"

export type Filter = Readonly<{
	type: "priority" | "identity"
	test: (a: Activity) => boolean
}>

export const identityFilter = Object.freeze({
	type: "identity",
	test: (a) => {
		const login = identity.value
		if (!login) return

		if ("pull_request" in a) {
			return a.requestedReviewers?.users?.some((u) => u.login === login)
		}
	},
} as Filter)

export const overdueFilter = Object.freeze({
	type: "priority",
	test: (a) => {
		if (!("pull_request" in a) || a.closed_at !== null) return false

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
