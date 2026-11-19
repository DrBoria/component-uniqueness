type InviteTeammateProps = {
	inviteEmail: string;
	onInviteEmailChange: (next: string) => void;
	onInvite: () => void;
};

export function InviteTeammate({ inviteEmail, onInviteEmailChange, onInvite }: InviteTeammateProps) {
	return (
		<section className="rounded-[12px] border border-[#e2e8f0] bg-[#ffffff] p-[20px]">
			<h2 className="m-[0px] text-[15px] font-semibold text-[#0f172a]">Invite a teammate</h2>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					onInvite();
				}}
				className="mt-[12px] flex flex-col gap-[8px]"
			>
				<label htmlFor="invite-email" className="text-[12px] font-medium text-[#475569]">
					Work email
				</label>
				<input
					id="invite-email"
					type="email"
					value={inviteEmail}
					placeholder="teammate@company.com"
					onChange={(event) => onInviteEmailChange(event.target.value)}
					className="h-[36px] rounded-[6px] border border-[#e2e8f0] px-[10px] text-[13px] text-[#0f172a]"
				/>
				<button
					type="submit"
					className="rounded-[6px] bg-[#0f172a] px-[12px] py-[8px] text-[12px] font-semibold text-[#ffffff] hover:bg-[#1e293b]"
				>
					Send invite
				</button>
			</form>
		</section>
	);
}
