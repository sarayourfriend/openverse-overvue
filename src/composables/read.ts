import type { Activity } from "./pulls"
import { useStorage } from "./use-storage"
import { getLastActivity } from "../utils/last-activity"

export const read = useStorage<Record<number, string>>("overvue:read", {})

/**
 * Allow batching writes
 */
export const markAsRead = (activities: Activity[]) => {
	const now = new Date(Date.now()).toISOString()
	read.value = activities.reduce(
		(acc, activity) => {
			return Object.assign(acc, { [activity.id]: now })
		},
		{ ...read.value },
	)
}

export const hasRead = (activity: Activity): boolean => {
	const lastReadBy = read.value[activity.id]

	if (!lastReadBy) return false

	return (
		new Date(getLastActivity(activity).updated_at).valueOf() <
		new Date(lastReadBy).valueOf()
	)
}
