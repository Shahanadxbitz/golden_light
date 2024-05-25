frappe.ui.form.on('Stock Entry', {
	// async refresh(frm) {

	// 	const divisions = await frappe.db.get_list("Division User", { filters: { parenttype: 'Division', user: frappe.session.user }, fields: ['parent'], pluck: 'parent'});

	// 	if(divisions.length <= 0) return;

	// 	const warehouses = await frappe.db.get_list("Division Permission", {
	// 	    filters: { parenttype: 'Division', document_type: 'Warehouse', parent: ['in', divisions], applicable_for: ['in', ["", "Stock Entry"]] },
	// 	    fields: ['document_name'],
	// 	    pluck: 'document_name',
	// 	});

	// 	if(warehouses.length <= 0) return;

	// 	const filters = [['name', 'in', warehouses], ['is_group', '=', 0]];

	// 	frm.set_query('from_warehouse', { filters });
	// 	frm.set_query('to_warehouse', { filters });

	// },
    // async refresh(frm) {
    //     frappe.call({
    //         method: 'client_golden_light.api.get_permitted_divisions',
    //         args: {
    //             user: frappe.session.user,
    //         },
    //         callback: function(response) {
    //             if(response.message.length <= 0) return;

    //             frappe.call({
    //                 method: 'client_golden_light.api.ge_permitted_warehouses',
    //                 args: {
    //                     divisions: response.message,
    //                 },
    //                 callback: function(response) {
    //                     const filters = [['name', 'in', warehouses], ['is_group', '=', 0]];
	// 	                frm.set_query('from_warehouse', { filters });
	//                 	frm.set_query('to_warehouse', { filters });
    //                 }
    //             });
    //         }
    //     });
    // },
    onload_post_render(frm){
        frappe.call({
            method: 'client_golden_light.warehouse_permissions.permitted_warehouse',
            args: {"company":frm.doc.company},
            callback: function(r) {
				console.log(r.message)
                frm.set_query("from_warehouse", function (frm) {
                    return {
                      "filters": {
                        "name": ["in",r.message],
                        "is_group":0,
                        "company": frm.company
                      }
                    }
                  })
            }
        });

        frappe.call({
            method: 'client_golden_light.warehouse_permissions.permitted_warehouse',
            args: {"company":frm.doc.company},
            callback: function(r) {
                frm.fields_dict['items'].grid.get_field('s_warehouse').get_query =
                function(doc, cdt, cdn) {
                    var child = locals[cdt][cdn];
                    return {
                        filters: {
                          'name': ['in',r.message],
                          'is_group': 0,
                          'company':doc.company
                    }
                    }
                }
            }
        });

	},
})
