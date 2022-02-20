import { reactive, ref, computed } from "vue"
import { request } from "../utils/request"
import type {
	GetResponseDataTypeFromEndpointMethod,
	Endpoints,
} from "@octokit/types"
import { auth, hasAuth, getHeaders } from "./auth"
import { checkRateLimit, didHitRateLimit } from "./rate-limit"
import { getLastActivity, LastActivityType } from "../utils/last-activity"
import type { Filter } from "../utils/filters"

export type Issue = GetResponseDataTypeFromEndpointMethod<
	() => Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]
>

export type Comment = GetResponseDataTypeFromEndpointMethod<
	() => Endpoints["GET /repos/{owner}/{repo}/comments/{comment_id}"]["response"]
>

export type Label = GetResponseDataTypeFromEndpointMethod<
	() => Endpoints["GET /repos/{owner}/{repo}/labels/{name}"]["response"]
>

export type Priority = "critical" | "high" | "medium" | "low"
export type Activity = Omit<Issue, "labels"> & {
	labels: (Pick<Label, "name"> & Partial<Omit<Label, "name">>)[]
	comment_list?: Comment[]
	priority?: Priority
	lastActivityType: LastActivityType
	lastActivity: Issue | Comment
}

export const Repos = Object.freeze([
	"openverse",
	"openverse-catalog",
	"openverse-api",
	"openverse-frontend",
] as const)

export type Repo = typeof Repos[number]

export const activityList = reactive({
	openverse: [],
	"openverse-catalog": [],
	"openverse-api": [],
	"openverse-frontend": [],
} as Record<Repo, Activity[]>)

export const filterList = ref([] as Filter[])
export const hasFilters = computed(() => Boolean(filterList.value.length))

export const isFiltered = (a: Activity): boolean =>
	filterList.value.length === 0 || filterList.value.some((f) => f.test(a))

export const useIsFiltered = (a: Activity) => computed(() => isFiltered(a))

export const allActivities = () => [
	...activityList["openverse"],
	...activityList["openverse-catalog"],
	...activityList["openverse-api"],
	...activityList["openverse-frontend"],
]

const fetchState: Record<Repo, boolean> = {
	openverse: false,
	"openverse-catalog": false,
	"openverse-api": false,
	"openverse-frontend": false,
}

const fetchComments = async <
	T extends Omit<Activity, "lastActivity" | "lastActivityType">,
>(
	activity: T[],
): Promise<T[]> => {
	return await Promise.all(
		activity.map(async (activity) => {
			try {
				const res = await request(activity.comments_url, {
					headers: getHeaders(),
					sort: "desc",
					per_page: 1,
				})

				checkRateLimit(res.headers)
				return { ...activity, comment_list: res.data ? res.data : [] }
			} catch (e) {
				console.error(
					`Unable to retrieve comments for issue(${activity.id})`,
					e,
				)
				return { ...activity, comment_list: [] }
			}
		}),
	)
}

const normalizeLabels = (issue: Issue) => ({
	...issue,
	labels: issue.labels.map((label) =>
		typeof label === "string" ? { name: label } : (label as Label),
	),
})

const withPriority = (activity: ReturnType<typeof normalizeLabels>) => ({
	...activity,
	priority: activity.labels
		.find((l) => l.name.includes("priority"))
		?.name.split(" ")
		.slice(-1)[0] as Priority,
})

const withLastActivity = (
	activity: Omit<Activity, "lastActivityType" | "lastActivity">,
) => {
	const [lastActivityType, lastActivity] = getLastActivity(activity)
	return { ...activity, lastActivityType, lastActivity }
}

const fetchIssues = async (repo: Repo): Promise<Activity[] | null> => {
	if (fetchState[repo] || didHitRateLimit.value) return []
	fetchState[repo] = true

	try {
		const res = await request("GET /repos/{owner}/{repo}/issues", {
			headers: getHeaders(),
			owner: "WordPress",
			repo,
			sort: "updated",
		})

		const issues = res.data.map((i) => withPriority(normalizeLabels(i)))

		if (checkRateLimit(res.headers) || !hasAuth(auth))
			return issues.map((i) => withLastActivity({ ...i, comment_list: [] }))

		return (await fetchComments(issues)).map(withLastActivity)
	} catch (e) {
		console.error(`Failed to retrieve issues for ${repo}`, e)
		return []
	} finally {
		fetchState[repo] = false
	}
}

const fetchActivity = async (repo: Repo) => {
	const activities = await fetchIssues(repo)
	if (activities) {
		activityList[repo] = activities
	}
}

Repos.forEach((repo) => fetchActivity(repo))
