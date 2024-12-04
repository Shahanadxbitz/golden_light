# Copyright (c) 2022, Peniel Technology and contributors
# For license information, please see license.txt

# import frappe
import frappe
from erpnext.accounts.utils import get_balance_on, get_children
from frappe import _


def execute(filters=None):
    columns, data = [], []

    columns = get_columns()

    cash_accounts = get_sub_accounts(filters.get("account"), list=[])

    for account in cash_accounts:
        balance = get_balance_on(account, filters.get("to_date"), in_account_currency=False)
        account_type = frappe.db.get_value("Account", account, "account_type")
        data.append(
            {
                "account": account,
                "balance_amount": balance,
                "account_type":account_type
            }
        )

    get_suppliers(data, filters)

    return columns, data


def get_conditions(filters):
    pass


def get_sub_accounts(account, list):
    accounts = frappe.db.get_list(
        "Account", {"parent_account": account}, ["name", "is_group"], order_by="name"
    )
    for row in accounts:
        if row.is_group == 1:
            get_sub_accounts(row.name, list)
        else:
            list.append(row.name)
    return list


def get_columns():
    """Creates a list of dictionaries that are used to generate column headers of the data table."""
    return [
        {
            "fieldname": "account",
            "label": _("Account"),
            "fieldtype": "Link",
            "options": "Account",
            "width": 350,
        },
        {
            "fieldname": "balance_amount",
            "label": _("Balance Amount"),
            "fieldtype": "Currency",
            "width": 150,
        },
        {
            "fieldname": "account_type",
            "label": _("Account Type"),
            "fieldtype": "Data",
            "width": 150,
        },
    ]


def get_suppliers(data, filters=None):
    if not (filters and filters.get("include_suppliers")):
        return

    suppliers = filters.get("include_suppliers")
    account = filters.get("account")

    # if not account:
    #     frappe.throw(_("Account is missing in filters."))

    for supplier in suppliers:
        # Fetch balance amount
        balance_amount = get_balance_on(
            party_type="Supplier", party=supplier, date=filters.get("to_date")
        )
        
        # Fetch account type
        # print(account)
        account_type = frappe.db.get_value("Account", account, "account_type")

        # Debugging logs
        # frappe.log_error(f"Account: {account}, Account Type: {account_type}, Supplier: {supplier}", "Debug Info")

        # Append supplier data to the list
        data.append({
            "account": account,
            "balance_amount": balance_amount,
            "party_type": "Supplier",
            "account_type": account_type,
        })
