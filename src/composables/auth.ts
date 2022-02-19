import { Ref, UnwrapRef, isRef } from "vue"
import { didHitRateLimit } from "./rate-limit"
import { useStorage, StorageSerializers } from "./use-storage"

const key = "overvue:gh-auth"
export const InvalidAuth = "invalid-auth"
export const auth = useStorage(
	key,
	null as string | typeof InvalidAuth | null,
	{ serializer: StorageSerializers.string },
)
type Auth = typeof auth
export const hasAuth = (auth: Auth | UnwrapRef<Auth>): auth is Ref<string> => {
	if (didHitRateLimit.value) return false

	const value = isRef(auth) ? auth.value : auth

	return typeof value === "string" && value !== InvalidAuth
}

export const getHeaders = () =>
	hasAuth(auth) ? { authorization: `token ${auth.value}` } : undefined
