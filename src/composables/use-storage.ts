import { ref, unref, watch, Ref } from "vue"
import { useEventListener, MaybeRef } from "./use-event-listener"

const defaultWindow =
	typeof window === "undefined" || !("localStorage" in window)
		? undefined
		: window

export type Serializer<T> = {
	read(v: string): T
	write(v: T): string
}

export const StorageSerializers = Object.freeze({
	boolean: {
		read: (v) => v === "true",
		write: (v) => String(v),
	} as Serializer<boolean>,
	number: {
		read: (v) => parseFloat(v),
		write: (v) => String(v),
	} as Serializer<number>,
	string: {
		read: (v) => v,
		write: (v) => String(v),
	} as Serializer<string>,
	object: {
		read: (v) => JSON.parse(v),
		write: (v) => JSON.stringify(v),
	} as Serializer<any>,
} as const)

export type UseStorageOptions<T> = {
	listenToStorageChanges: boolean
	writeDefaults: boolean
	window: Window
	storage: Storage
	serializer: Serializer<T>
	onError: (e: Error) => void
}

const defaultStorageOptions = Object.freeze({
	listenToStorageChanges: true,
	writeDefaults: true,
	window: defaultWindow,
	storage: defaultWindow?.localStorage,
	serializer: StorageSerializers.object,
	onError: (e) => {
		console.error(e)
	},
} as UseStorageOptions<unknown>)

/**
 * Reactive LocalStorage.
 *
 * @see https://vueuse.org/useStorage
 */
export function useStorage<T>(
	key: string,
	initialValue: MaybeRef<T>,
	options: Partial<UseStorageOptions<T>> = {},
) {
	const optionsWithDefaults = {
		...defaultStorageOptions,
		...options,
	}
	const { listenToStorageChanges, writeDefaults, window, storage, onError } =
		optionsWithDefaults

	const rawInit = unref(initialValue)

	const type =
		rawInit == null
			? "object"
			: typeof rawInit === "boolean"
			? "boolean"
			: typeof rawInit === "string"
			? "string"
			: typeof rawInit === "number"
			? "number"
			: "object"

	const data = ref(rawInit) as Ref<T>
	const serializer = options.serializer ?? StorageSerializers[type]

	function read(event?: StorageEvent) {
		if (!storage || (event && event.key !== key)) return

		try {
			const rawValue = event ? event.newValue : storage.getItem(key)
			if (rawValue == null) {
				data.value = rawInit
				if (writeDefaults && rawInit !== null)
					storage.setItem(key, serializer.write(rawInit))
			} else {
				data.value = serializer.read(rawValue)
			}
		} catch (e) {
			onError(e as Error)
		}
	}

	read()

	if (window && listenToStorageChanges)
		useEventListener(window, "storage", (e: Event) =>
			setTimeout(() => read(e as StorageEvent), 0),
		)

	if (storage) {
		watch(data, () => {
			try {
				if (data.value == null) storage.removeItem(key)
				else storage.setItem(key, serializer.write(data.value))
			} catch (e) {
				onError(e as Error)
			}
		})
	}

	return data
}
