type PressableActionProps = {
	caption: string;
	onPress: () => void;
	inert?: boolean;
};

/**
 * Same widget rebuilt as a div with role="button" + tabIndex.
 * Announces exactly like PrimaryAction: role button, name from inner text.
 */
export function PressableAction({ caption, onPress, inert = false }: PressableActionProps) {
	const press = () => {
		if (!inert) {
			onPress();
		}
	};

	return (
		<div
			role="button"
			tabIndex={inert ? -1 : 0}
			aria-disabled={inert}
			onClick={press}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					press();
				}
			}}
			className="inline-flex items-center gap-[8px] rounded-[6px] bg-[#4f46e5] px-[16px] py-[8px] text-[13px] font-semibold text-[#ffffff] hover:bg-[#4338ca] disabled:opacity-50"
		>
			<svg viewBox="0 0 20 20" aria-hidden="true" className="h-[16px] w-[16px] fill-current" />
			<span>{caption}</span>
		</div>
	);
}
