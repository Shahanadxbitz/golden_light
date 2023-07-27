# Copyright (c) 2022, Peniel Technology LLC and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.query_builder import Criterion
from frappe.query_builder.functions import IfNull, Sum


def execute(filters=None):

    columns = [
        {"label": _("Date"), "fieldname": "posting_date", "fieldtype": "Date", "width": 120},
        {
            "label": _("Voucher Type"),
            "fieldname": "voucher_type",
            "fieldtype": "Data",
            "width": 200,
        },
        {
            "label": _("Voucher No"),
            "fieldname": "voucher_no",
            "fieldtype": "Dynamic Link",
            "options": "voucher_type",
            "width": 150,
        },
        {
            "label": _("Debit"),
            "fieldname": "debit",
            "fieldtype": "Currency",
            "width": 150,
        },
        {
            "label": _("Credit"),
            "fieldname": "credit",
            "fieldtype": "Currency",
            "width": 150,
        },
        {
            "label": _("Balance"),
            "fieldname": "balance",
            "fieldtype": "Currency",
            "width": 150,
        },
        {
            "label": _("Cost Center"),
            "fieldname": "cost_center",
            "fieldtype": "Link",
            "options": "Cost Center",
            "width": 150,
        },
        {
            "label": _("Remarks"),
            "fieldname": "remarks",
            "fieldtype": "Data",
            "width": 300,
        },
        {
            "label": _("Account"),
            "fieldname": "account",
            "fieldtype": "Link",
            "options": "Account",
            "width": 150,
        },
        {
            "label": _("Against Account"),
            "fieldname": "against",
            "fieldtype": "Link",
            "options": "Account",
            "width": 150,
        },
    ]

    conditions = get_conditions(filters)
    gl_entries = get_gl_entries(filters, conditions)
    opening, total, closing = get_opening_and_totals(filters, conditions)

    data = []
    data.append(opening)
    data += gl_entries
    data.append(total)
    data.append(closing)

    data = get_balances(data)

    report_summary = get_report_summary(filters, closing)

    return columns, data, None, None, report_summary


def get_conditions(filters):

    GL_Entry = frappe.qb.DocType("GL Entry")

    conditions = [
        GL_Entry.is_cancelled == 0,
        GL_Entry.party == filters.get("party"),
        ((GL_Entry.party_type == "Customer") | (GL_Entry.party_type == "Supplier")),
    ]

    if filters.get("cost_center"):
        conditions.append(GL_Entry.cost_center == filters.get("cost_center"))

    return Criterion.all(conditions)


def get_gl_entries(filters, conditions):

    GL_Entry = frappe.qb.DocType("GL Entry")

    from_date = filters.get("from_date")
    to_date = filters.get("to_date")

    entries = (
        frappe.qb.from_(GL_Entry)
        .select(
            GL_Entry.posting_date,
            GL_Entry.voucher_type,
            GL_Entry.voucher_no,
            IfNull(Sum(GL_Entry.debit), 0).as_("debit"),
            IfNull(Sum(GL_Entry.credit), 0).as_("credit"),
            GL_Entry.cost_center,
            GL_Entry.remarks,
            GL_Entry.account,
            GL_Entry.against,
        )
        .where(conditions)
        .where(GL_Entry.posting_date[from_date:to_date])
        .orderby(GL_Entry.posting_date, GL_Entry.creation)
        .groupby(GL_Entry.voucher_no)
        .run(as_dict=True)
    )

    return entries


def get_last_voucher_entry(filters, conditions, voucher_type, is_receipt=0):

    GL_Entry = frappe.qb.DocType("GL Entry")

    from_date = filters.get("from_date")
    to_date = filters.get("to_date")

    debit_or_credit = GL_Entry.debit > 0
    if voucher_type in "Payment Entry" and is_receipt == 1:
        debit_or_credit = GL_Entry.credit > 0
    elif voucher_type in "Purchase Invoice":
        debit_or_credit = GL_Entry.credit > 0

    entries = (
        frappe.qb.from_(GL_Entry)
        .select(
            GL_Entry.posting_date,
            GL_Entry.voucher_type,
            GL_Entry.voucher_no,
            GL_Entry.debit,
            GL_Entry.credit,
        )
        .where(conditions)
        .where(GL_Entry.posting_date[from_date:to_date])
        .where(GL_Entry.voucher_type == voucher_type)
        .where(debit_or_credit)
        .orderby(GL_Entry.posting_date, GL_Entry.creation, order=frappe.qb.desc)
        .limit(1)
        .run(as_dict=True)
    )

    return entries


def get_opening_and_totals(filters, conditions):

    GL_Entry = frappe.qb.DocType("GL Entry")

    from_date = filters.get("from_date")
    to_date = filters.get("to_date")

    opening = (
        frappe.qb.from_(GL_Entry)
        .select(
            IfNull(Sum(GL_Entry.debit), 0).as_("debit"),
            IfNull(Sum(GL_Entry.credit), 0).as_("credit"),
        )
        .where(conditions)
        .where(GL_Entry.posting_date < from_date)
        .run(as_dict=True)
    )[0]

    opening["voucher_type"] = _("Opening")

    total = (
        frappe.qb.from_(GL_Entry)
        .select(
            IfNull(Sum(GL_Entry.debit), 0).as_("debit"),
            IfNull(Sum(GL_Entry.credit), 0).as_("credit"),
        )
        .where(conditions)
        .where(GL_Entry.posting_date[from_date:to_date])
        .run(as_dict=True)
    )[0]

    total["voucher_type"] = _("Total")

    closing = {
        "debit": opening.debit + total.debit,
        "credit": opening.credit + total.credit,
        "voucher_type": _("Closing (Opening + Total)"),
    }
    return opening, total, closing


def get_balances(data):

    balance = 0
    for d in data:
        if not d.get("posting_date"):
            balance = 0

        balance = balance + (d.get("debit", 0) - d.get("credit", 0))

        d["balance"] = balance

    return data


def get_report_summary(filters, closing):

    balance = closing.get("debit", 0) - closing.get("credit", 0)

    report_summary = []

    # Last Sales Invoice
    last_sales_invoice_record = get_last_voucher_entry(
        filters, get_conditions(filters), "Sales Invoice"
    )

    if last_sales_invoice_record:

        last_sales_invoice_summary = {
            "label": _("Last Sales Invoice Amount"),
            "value": last_sales_invoice_record[0]["debit"],
            "indicator": "Green",
            "datatype": "Currency",
            "currency": "USD",
        }

        report_summary.append(last_sales_invoice_summary)

    # Last Payment Entry (Receipt)
    last_receipt_record = get_last_voucher_entry(
        filters, get_conditions(filters), "Payment Entry", 1
    )

    if last_receipt_record:

        last_received_value = {
            "label": _("Last Received Amount"),
            "value": last_receipt_record[0]["credit"],
            "indicator": "Green",
            "datatype": "Currency",
            "currency": "USD",
        }

        report_summary.append(last_received_value)

    # Last Purchase Invoice
    last_purchase_invoice_record = get_last_voucher_entry(
        filters, get_conditions(filters), "Purchase Invoice"
    )

    if last_purchase_invoice_record:

        last_purchase_invoice_summary = {
            "label": _("Last Purchase Invoice Amount"),
            "value": last_purchase_invoice_record[0]["credit"],
            "indicator": "Red",
            "datatype": "Currency",
            "currency": "USD",
        }

        report_summary.append(last_purchase_invoice_summary)

    # Last Payment Entry (Receipt)
    last_payment_record = get_last_voucher_entry(filters, get_conditions(filters), "Payment Entry")

    if last_payment_record:

        last_paid_value = {
            "label": _("Last Paid Amount"),
            "value": last_payment_record[0]["debit"],
            "indicator": "Red",
            "datatype": "Currency",
            "currency": "USD",
        }

        report_summary.append(last_paid_value)

    if balance <= 0:
        balance_summary = {
            "label": _("Amount Payable"),
            "value": -balance,
            "indicator": "Red",
            "datatype": "Currency",
            "currency": "USD",
        }
    else:
        balance_summary = {
            "label": _("Amount Receivable"),
            "value": balance,
            "indicator": "Green",
            "datatype": "Currency",
            "currency": "USD",
        }

    report_summary.append(balance_summary)

    return report_summary
