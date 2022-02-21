import { useStorage } from "./use-storage"

export const hideRead = useStorage<Boolean>("overvue:hide-read", false)

export const toggleHidingRead = () => {
	hideRead.value = !hideRead.value
}
