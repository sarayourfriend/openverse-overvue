import { isRef, watch, readonly, ref } from "vue"
import { didHitRateLimit } from "./rate-limit"
import { useStorage, StorageSerializers } from "./use-storage"
import { request } from "../utils/request"

const key = "overvue:gh-auth"
export const InvalidAuth = "invalid-auth"
export type Auth = string | typeof InvalidAuth | null
export const auth = useStorage(key, null as Auth, {
	serializer: StorageSerializers.string,
})

export const hasAuth = (auth: Auth): auth is string => {
	if (didHitRateLimit.value) return false

	const value = isRef(auth) ? auth.value : auth

	return typeof value === "string" && value !== InvalidAuth
}

export const getHeaders = () =>
	hasAuth(auth.value) ? { authorization: `token ${auth.value}` } : undefined

const _identity = ref(null as string | null)
export const identity = readonly(_identity)

let isFetching = false
watch(
	auth,
	async (auth) => {
		if (isFetching) return
		isFetching = true
		try {
			if (!hasAuth(auth)) {
				_identity.value = null
				return
			}

			const res = await request("GET /user", { headers: getHeaders() })
			_identity.value = res.data.login
		} catch (e) {
			console.error("Unable to retrieve identity with current token", e)
		} finally {
			isFetching = false
		}
	},
	{ immediate: true },
)
