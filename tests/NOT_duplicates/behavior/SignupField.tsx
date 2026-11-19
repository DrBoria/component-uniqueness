type SignupFieldProps = {
	id: string;
	value: string;
	onEdit: (next: string) => void;
};

export function SignupField({ id, value, onEdit }: SignupFieldProps) {
	return (
		<>
			<label htmlFor={id} className="text-[12px] font-medium text-[#475569]">
				Email address
			</label>
			<input
				id={id}
				type="email"
				value={value}
				placeholder="you@company.com"
				onChange={(event) => onEdit(event.target.value)}
				className="h-[36px] rounded-[6px] border border-[#e2e8f0] px-[10px] text-[13px] text-[#0f172a]"
			/>
		</>
	);
}
