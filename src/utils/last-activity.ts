export type LastActivityType = "update" | "comment"

export const getLastActivity = <
	T extends {
		comment_list?: { updated_at: string }[]
		updated_at: string
	},
>(
	activity: T,
): [LastActivityType, Exclude<T["comment_list"], undefined>[number] | T] => {
	const lastActivityType: LastActivityType =
		!activity.comment_list || activity.comment_list.length === 0
			? "update"
			: new Date(activity.updated_at).valueOf() >=
			  new Date(activity.comment_list[0].updated_at).valueOf()
			? "update"
			: "comment"

	return [
		lastActivityType,
		lastActivityType === "update"
			? activity
			: activity.comment_list?.[0] ?? activity,
	]
}
