import frappe
# from erpnext.stock.report.stock_balance.stock_balance import (
#     StockBalanceReport,
# )

from client_golden_light.customizations_for_golden_light.report.stock_balance_gl.stock_balance_gl import (
    get_items,
    get_item_details,
    get_item_warehouse_map,
    get_stock_ledger_entries
) 
from erpnext.stock.utils import is_reposting_item_valuation_in_progress
from frappe import _
from frappe.utils import flt
from six import iteritems


def execute(filters=None):
    is_reposting_item_valuation_in_progress()
    if not filters:
        filters = {}

    filters["from_date"] = filters["to_date"] = frappe.utils.nowdate()

    # validate_filters(filters)

    columns = get_columns(filters)

    items = get_items(filters)
    sle = get_stock_ledger_entries(filters, items)

    item_map = get_item_details(items, sle, filters)
    iwb_map = get_item_warehouse_map(filters, sle)
    warehouse_list = get_warehouse_list(filters)

    data = []
    item_balance = {}

    for (company, item, warehouse) in sorted(iwb_map):
        if not item_map.get(item):
            continue

        qty_dict = iwb_map[(company, item, warehouse)]
        item_balance.setdefault((item, item_map[item]["item_group"]), {})

        row = {warehouse: qty_dict.bal_qty}
        item_balance[(item, item_map[item]["item_group"])].update(row)

    # sum bal_qty by item
    for (item, item_group), wh_balance in iteritems(item_balance):
        row = {"item": item}

        row.update(wh_balance)
        total_qty = sum(wh_balance.values())
        if len(warehouse_list) > 1:
            row["total_qty"] = total_qty

        if total_qty > 0:
            data.append(row)
        elif not filters.get("filter_total_zero_qty"):
            data.append(row)

    val=add_warehouse_column(columns, warehouse_list)
    print("val",val)

    
    return columns, data


def get_columns(filters):

    columns = [
        {
            "label": _("Item"),
            "fieldname": "item",
            "fieldtype": "Link",
            "options": "Item",
            "width": 300,
        }
    ]
    return columns


def validate_filters(filters):
    if not (filters.get("item_code") or filters.get("warehouse")):
        sle_count = flt(frappe.db.sql("""select count(name) from `tabStock Ledger Entry`""")[0][0])
        if sle_count > 500000:
            frappe.throw(_("Please set filter based on Item or Warehouse"))
    if not filters.get("company"):
        filters["company"] = frappe.defaults.get_user_default("Company")


def get_warehouse_list(filters):
    """
    Fetch and sort the warehouse list based on `report_order`.
    Warehouses with `report_order` = 0 will appear last.
    """
    warehouses = frappe.get_all(
        "Warehouse",
        fields=["name", "report_order"],
        filters={"company": frappe.defaults.get_user_default("Company")},
        order_by="report_order, name"
    )

    # Sort warehouses with 0 `report_order` last
    sorted_warehouses = sorted(
        warehouses,
        key=lambda x: (x["report_order"] == 0, x["report_order"], x["name"]),
    )

    return [wh["name"] for wh in sorted_warehouses]



def add_warehouse_column(columns, warehouse_list):
    """
    Add columns for warehouses based on the sorted warehouse list.
    """
    for warehouse in warehouse_list:
        columns.append(
            {
                "label": _(warehouse),
                "fieldname": warehouse,
                "fieldtype": "Float",
                "width": 100,
            }
        )

    # Add a Total Qty column if there are multiple warehouses
    if len(warehouse_list) > 1:
        columns.append(
            {
                "label": _("Total Qty"),
                "fieldname": "total_qty",
                "fieldtype": "Float",
                "width": 100,
            }
        )


