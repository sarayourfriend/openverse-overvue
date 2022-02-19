<script setup lang="ts">
import { auth, hasAuth, InvalidAuth } from "../composables/auth"
import { didHitRateLimit, rateLimitReset } from "../composables/rate-limit"
import { relativeTime } from "../utils/relative-time"

type AuthFormElement = HTMLFormElement & { auth: HTMLInputElement }

const handleSubmit = (event: Event) => {
	auth.value = (event.currentTarget as AuthFormElement).auth.value
}

const formatReset = () =>
	rateLimitReset.value &&
	relativeTime(new Date(rateLimitReset.value).toDateString())
</script>

<template>
	<form v-if="!hasAuth(auth)" @submit.prevent="handleSubmit">
		<details>
			<summary>Expand if you want to raise your GitHub rate limit.</summary>
			<p>
				If you'd like to get even <em>more</em> information (like when an issue
				or pull request was last updated and by whom), please provide a
				<a
					href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token"
					target="_blank"
					rel="noopener noreferrer"
					>GitHub personal access token</a
				>.
			</p>
			<p>
				This token will only be stored in your browser's
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
					target="_blank"
					rel="noopener noreferrer"
					><code>localStorage</code></a
				>
				and will only be used to request information about activites in the
				public Openverse repositories.
				<strong
					>For your security, do not provide the token with any specific scopes!
					Leave all the scope checkboxes blank. This application does not need
					them and merely uses the token to increase the rate limit. Remember to
					always practice the
					<a
						href="https://en.wikipedia.org/wiki/Principle_of_least_privilege"
						target="_blank"
						rel="noopener noreferrer"
						>principle of least privilege</a
					>.</strong
				>
			</p>
			<p>
				Providing a token is entirely optional. Without it you'll probably hit a
				rate limit if you visit this site often. Likewise, some features will be
				disabled to prevent hitting the rate limit (like specifics about who
				updated a pull request or issue).
			</p>
			<p v-if="auth === InvalidAuth">
				Whoops, it looks like your personal access token wasn't valid. Check to
				see if it's expired.
			</p>
			<p v-if="didHitRateLimit">
				Oh dear, your rate limit for the GitHub API has been reached. It will
				reset in {{ formatReset() }}.
			</p>
			<label
				>GitHub personal access token: <input type="text" name="auth" required
			/></label>
		</details>
	</form>
	<div v-else>Enjoy the "vue" 😎</div>
</template>
