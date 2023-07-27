frappe.ui.form.on('Material Request', {
	refresh(frm) {

		$(".dropdown-menu .dropdown-item[data-label='Pick%20List']").hide();

		const wh_group_filter = () => ({
			filters: {
				"is_group": 0,
			}
		});

		frm.set_query("set_from_warehouse", wh_group_filter);
		frm.set_query("set_warehouse", wh_group_filter);

		if(!frm.is_new()) return;

		frm.set_df_property('material_request_type', 'options', ['Material Transfer', 'Purchase']);
    	frm.set_value("naming_series","MR-MT-");
		frm.set_value("material_request_type", "Material Transfer");
	},

	material_request_type(frm) {


    		frm.set_value("naming_series","MR-MT-");

        	if (frm.doc.material_request_type == 'Purchase'){
        	    frm.set_value("naming_series","MR-PR-");
        	}

        	frm.refresh_field("naming_series");

	},

})
