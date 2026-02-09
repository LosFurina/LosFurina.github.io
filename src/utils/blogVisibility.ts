import type { CollectionEntry } from "astro:content";

export function shouldIncludeDrafts(): boolean {
	return import.meta.env.DEV || import.meta.env.SHOW_DRAFTS === "true";
}

export function isDraftPost(post: CollectionEntry<"blog">): boolean {
	return post.data.draft === true;
}

export function filterVisiblePosts(
	posts: CollectionEntry<"blog">[],
): CollectionEntry<"blog">[] {
	if (shouldIncludeDrafts()) {
		return posts;
	}
	return posts.filter((post) => !isDraftPost(post));
}
