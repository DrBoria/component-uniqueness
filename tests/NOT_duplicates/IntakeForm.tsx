import React from "react";

const IntakeForm = ({ onSubmit, onChange }: { onSubmit: () => void; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
	return (
		<form className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6" onSubmit={onSubmit}>
			<label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
				Full name
				<input type="text" name="name" onChange={onChange} className="rounded border border-gray-300 px-2 py-1" />
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
				Phone
				<input type="tel" name="phone" onChange={onChange} className="rounded border border-gray-300 px-2 py-1" />
			</label>
			<label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
				Reason for visit
				<input type="text" name="reason" onChange={onChange} className="rounded border border-gray-300 px-2 py-1" />
			</label>
			<div className="mt-2 flex justify-end">
				<button type="submit" className="rounded bg-green-600 px-4 py-2 text-sm text-white">
					Submit intake
				</button>
			</div>
		</form>
	);
};

export default IntakeForm;
