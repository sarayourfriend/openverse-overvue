import type { Activity } from "./pulls"
import { useStorage } from "./use-storage"

export const hideRead = useStorage<Boolean>("overvue:hide-read", false)

export const toggleHidingRead = (activities: Activity[]) => {
	hideRead.value = !hideRead.value
}
