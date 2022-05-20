export function initSlots(instance, children) {
	// children object

	normalizeObjectSlots(children, instance.slots);
}

function normalizeObjectSlots(children: any, slots: any) {
	for (const key in children) {
		const value = children[key];
		// slot
		slots[key] = normalizeSlotValue(value);
	}
}

function normalizeSlotValue(value) {
	return Array.isArray(value) ? value : [value];
}
