import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { performRequest } from "@/lib/datocms";

import { PostsFilter } from "./components/filter";

interface Post {
	id: string;
	name: string;
	description: string;
	category: string;
	tags: string;
	externalLink?: string;
	image: { url: string };
	_createdAt: string;
	_updatedAt: string;
}

interface SearchParams {
	search?: string;
	category?: "all" | "technology" | "philosophy";
	items?: "15" | "25" | "50";
	sortBy?: "_createdAt" | "name";
	page?: string;
}

const QUERY = `
  query {
    allPosts(filter: {
      isPublished: { eq: true }
    }) {
      category
      description
      id
      name
      tags
      externalLink
      image {
        url
      }
      _createdAt
      _updatedAt
    }
  }
`;

export default async function ArticlesPage(props: {
	searchParams?: Promise<SearchParams>;
}) {
	const searchParams = await props.searchParams;
	const search = searchParams?.search || "";
	const term = search.trim().toLowerCase();
	const category = searchParams?.category || "tecnologia";
	const itemsPerPage = Number(searchParams?.items) || 15;
	const sortBy = (searchParams?.sortBy || "_createdAt") as keyof Post;

	const {
		data: { allPosts },
	} = await performRequest({ query: QUERY });

	function formatDate(dateString: string): string {
		return format(new Date(dateString), "dd MMMM yyyy", { locale: ptBR });
	}

	function formatLink(postId: string, externalLink?: string) {
		if (externalLink) return externalLink;
		return "/articles/" + postId;
	}

	const filteredPosts = allPosts.filter((post: Post) => {
		if (post.category.toLowerCase() !== category.toLowerCase()) return false;
		return !term || post.name.toLowerCase().includes(term);
	});

	filteredPosts.sort((a: Post, b: Post) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (sortBy === "_createdAt") {
			return (
				new Date(bValue as string).getTime() -
				new Date(aValue as string).getTime()
			);
		}

		if (typeof aValue === "string" && typeof bValue === "string") {
			return aValue.localeCompare(bValue);
		}

		return 0;
	});

	const displayedPosts = filteredPosts.slice(0, itemsPerPage);

	return (
		<>
			<Head>
				<title>Welcome</title>
				<link rel="preconnect" href="https://rsms.me/" />
				<link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
			</Head>
			<div className="w-full max-w-3xl mx-auto pt-10 px-4 sm:px-6 lg:px-8 mb-8">
				<div className="flex justify-between items-center">
					<h2 className="my-4 text-2xl font-semibold text-pretty">Blog</h2>
					<Button variant="ghost">
						<Link href="/">Voltar</Link>
					</Button>
				</div>
				<PostsFilter />
				<div className="space-y-6">
					{displayedPosts.map((post: Post) => (
						<article key={post.id} className="group">
							<Link
								href={formatLink(post.id, post.externalLink)}
								target={post.externalLink ? "_blank" : "_self"}
								className="block"
							>
								<div className="flex gap-4">
									<div className="shrink-0">
										<Image
											className="w-40 h-40 object-cover rounded-lg bg-gray-100 dark:bg-neutral-800"
											src={post.image.url}
											alt={post.name}
											width={160}
											height={160}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-2">
											<time className="text-xs text-gray-500 dark:text-neutral-500">
												{formatDate(post._createdAt)}
											</time>
										</div>
										<h3 className="font-semibold text-sm text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
											{post.name}
										</h3>
										<p className="mt-1 text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
											{post.description}
										</p>
									</div>
								</div>
							</Link>
						</article>
					))}
				</div>
			</div>
		</>
	);
}
