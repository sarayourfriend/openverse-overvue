import { reactive } from "vue"
import { request } from "../utils/request"
import type {
	GetResponseDataTypeFromEndpointMethod,
	Endpoints,
} from "@octokit/types"
import { auth, hasAuth, getHeaders } from "./auth"
import { checkRateLimit, didHitRateLimit } from "./rate-limit"

export type Issue = GetResponseDataTypeFromEndpointMethod<
	() => Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]
>

export type Comment = GetResponseDataTypeFromEndpointMethod<
	() => Endpoints["GET /repos/{owner}/{repo}/comments/{comment_id}"]["response"]
>

export type Activity = Issue & { comment_list: Comment[] }

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

const fetchComments = async (issues: Issue[]): Promise<Activity[]> => {
	return await Promise.all(
		issues.map(async (issue): Promise<Activity> => {
			const res = await request(issue.comments_url, {
				headers: getHeaders(),
				sort: "desc",
				per_page: 1,
			})

			checkRateLimit(res.headers)

			return { ...issue, comment_list: res.data ? res.data : [] }
		}),
	)
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

		if (checkRateLimit(res.headers) || !hasAuth(auth))
			return res.data.map((i) => ({ ...i, comment_list: [] }))

		return fetchComments(res.data)
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
