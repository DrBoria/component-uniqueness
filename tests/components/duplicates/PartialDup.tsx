import React from "react";

interface PartialDupProps {
	name: string;
	onSave: () => void;
	onCancel: () => void;
}

const PartialDup = ({ name, onSave, onCancel }: PartialDupProps) => {
	return (
		<div className="space-y-4">
			<h3 className="text-base font-semibold text-gray-900">Edit profile</h3>
			<label className="block">
				<span className="text-sm font-medium text-gray-700">Name</span>
				<input type="text" defaultValue={name} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
			</label>
			<span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
				Verified
			</span>
			<div className="flex justify-end gap-2">
				<button type="button" onClick={onCancel} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
					Cancel
				</button>
				<button type="button" onClick={onSave} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
					Save
				</button>
			</div>
		</div>
	);
};

export default PartialDup;
