import type { Activity, Issue, Comment } from "../composables/pulls"

type LastActivityType = "update" | "comment"

export const getLastActivity = (activity: Activity): Issue | Comment => {
	const lastActivityType: LastActivityType =
		!activity.comment_list || activity.comment_list.length === 0
			? "update"
			: new Date(activity.updated_at).valueOf() >=
			  new Date(activity.comment_list[0].updated_at).valueOf()
			? "update"
			: "comment"

	return lastActivityType === "update"
		? activity
		: activity.comment_list?.[0] ?? activity
}
