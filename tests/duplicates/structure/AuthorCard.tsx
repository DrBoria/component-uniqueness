import Image from "next/image";
import Link from "next/link";

type AuthorCardProps = {
	avatar: string;
	name: string;
	bio: string;
	profileHref: string;
};

/**
 * NEGATIVE trap. Same article shell, same border/radius/padding and the same
 * typographic scale as StatCard, but a different component: avatar image, a
 * two-line bio and a navigation link instead of a metric + delta.
 */
export function AuthorCard({ avatar, name, bio, profileHref }: AuthorCardProps) {
	return (
		<article className="flex w-[220px] flex-col gap-[6px] rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[16px]">
			<Image
				src={avatar}
				alt=""
				width={48}
				height={48}
				className="h-[48px] w-[48px] rounded-full object-cover"
			/>
			<h3 className="m-[0px] text-[14px] font-semibold text-[#0f172a]">{name}</h3>
			<p className="m-[0px] text-[12px] leading-[18px] text-[#64748b]">{bio}</p>
			<Link
				href={profileHref}
				className="text-[12px] font-medium text-[#4f46e5] hover:underline"
			>
				View profile
			</Link>
		</article>
	);
}
