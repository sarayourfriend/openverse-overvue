import { ref, readonly } from "vue"
import type { ResponseHeaders } from "@octokit/types"
import { request } from "../utils/request"
import { getHeaders } from "./auth"

const _didHitRateLimit = ref(false)
const _rateLimitReset = ref<number>()
const _rateLimitRemaining = ref<number>()

export const didHitRateLimit = readonly(_didHitRateLimit)
export const rateLimitReset = readonly(_rateLimitReset)
export const rateLimitRemaining = readonly(_rateLimitRemaining)

export const checkRateLimit = (headers: ResponseHeaders): boolean => {
	_rateLimitRemaining.value =
		(headers["x-ratelimit-remaining"] &&
			parseInt(headers["x-ratelimit-remaining"], 10)) ||
		undefined

	if (rateLimitRemaining.value === 0) {
		_didHitRateLimit.value = true
		_rateLimitReset.value =
			(headers["x-ratelimit-reset"] &&
				parseInt(headers["x-ratelimit-reset"], 10)) ||
			undefined
	}

	return didHitRateLimit.value
}

export const initRateLimit = async (): Promise<boolean> => {
	try {
		const res = await request("GET /rate_limit", { headers: getHeaders() })
		_rateLimitRemaining.value = res.data.rate.remaining
		if (rateLimitRemaining.value === 0) {
			_didHitRateLimit.value = true
			_rateLimitReset.value = res.data.rate.reset
		}

		return didHitRateLimit.value
	} catch (e) {
		console.error("Unable to request rate limit! Proceed with caution!", e)
		return false
	}
}
