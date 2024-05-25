import frappe

@frappe.whitelist()
def get_permitted_divisions(user):
    divisions = frappe.db.get_all("Division User", { "filters": { "parenttype": 'Division', "user": user }, "fields": ['parent'], "pluck": 'parent'})
    return divisions

@frappe.whitelist()
def get_permitted_warehouses(divisions):
    warehouses =  frappe.db.get_all("Division Permission", {
        "filters": { "parenttype": 'Division', "document_type": 'Warehouse', "parent": ['in', divisions], "applicable_for": ['in', ["", "Stock Entry"]] },
	    "fields": ['document_name'],
	    "pluck": 'document_name',
		})
    return warehouses