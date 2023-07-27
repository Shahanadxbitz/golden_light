frappe.ui.form.on('Stock Entry', {
	async refresh(frm) {

		const divisions = await frappe.db.get_list("Division User", { filters: { parenttype: 'Division', user: frappe.session.user }, fields: ['parent'], pluck: 'parent'});

		if(divisions.length <= 0) return;

		const warehouses = await frappe.db.get_list("Division Permission", {
		    filters: { parenttype: 'Division', document_type: 'Warehouse', parent: ['in', divisions], applicable_for: ['in', ["", "Stock Entry"]] },
		    fields: ['document_name'],
		    pluck: 'document_name',
		});

		if(warehouses.length <= 0) return;

		const filters = [['name', 'in', warehouses], ['is_group', '=', 0]];

		frm.set_query('from_warehouse', { filters });
		frm.set_query('to_warehouse', { filters });

	}
})
