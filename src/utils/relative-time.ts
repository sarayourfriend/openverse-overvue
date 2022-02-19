const oneSecond = 1e3
const oneMinute = oneSecond * 60
const oneHour = oneMinute * 60
const oneDay = oneHour * 24

const getFormatOptions = (
	ms: number,
): Parameters<Intl.RelativeTimeFormat["format"]> => {
	const days = ms / oneDay
	const hours = ms / oneHour
	const minutes = ms / oneMinute
	const seconds = ms / oneSecond

	if (days >= 1) {
		return [days, days === 1 ? "day" : "days"]
	}

	if (hours >= 1) {
		return [hours, hours === 1 ? "hour" : "hours"]
	}

	if (minutes >= 1) {
		return [minutes, minutes === 1 ? "minute" : "minutes"]
	}

	return [Math.max(1, seconds), seconds <= 1 ? "second" : "seconds"]
}

export const relativeTime = (date: string) => {
	const d = new Date(date)
	const now = new Date(Date.now())
	const diff = now.valueOf() - d.valueOf()

	const [formatNumber, format] = getFormatOptions(diff)
	const [, { value: n }, { value: unit }] =
		new Intl.RelativeTimeFormat().formatToParts(
			Math.floor(formatNumber),
			format,
		)
	return n + unit
}
