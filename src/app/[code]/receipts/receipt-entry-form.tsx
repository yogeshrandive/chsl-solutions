/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tables } from "@/utils/supabase/database.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getMemberBillsByMemberId } from "@/models/memberBills";
import { createReceiptInDb } from "@/models/receipt";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
    memberId: z.number({
        required_error: "Please select a member",
    }),
    bookId: z.number({
        required_error: "Please select a book",
    }),
    receiptNumber: z.number({
        required_error: "Receipt number is required",
    }),
    receiptDate: z.string({
        required_error: "Receipt date is required",
    }),
    amount: z.coerce.number({
        required_error: "Amount is required",
    }).positive().refine((n) => !Number.isInteger(n) || Number.isInteger(n), {
        message: "Amount can be decimal or whole number",
    }),
    modeOfPayment: z.enum([
        "check_book",
        "upi",
        "net_banking",
        "cash",
        "card",
        "other",
    ], {
        required_error: "Please select payment mode",
    }),
    transactionId: z.string().optional(),
    transactionDate: z.string().optional(),
    bankName: z.string().optional(),
});

type Props = {
    members: {
        id: number;
        code: string;
        full_name: string;
        email: string;
        mobile: string;
        flat_no: string;
    }[];
    books: Tables<"society_book_master">[];
    societyData: Tables<"societies">;
};

export default function ReceiptEntryForm({
    members,
    books,
    societyData,
}: Props) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState<
        typeof members[0] | null
    >(null);
    const [billDetails, setBillDetails] = useState<
        (Tables<"member_bills"> & {
            society_bills: {
                bill_frequency: string;
                bill_date: string;
                due_date: string;
                bill_lot: string;
                interest_period: string;
                credit_adj_first: boolean;
                bill_period_from: string;
                bill_period_to: string;
                interest_rate: number;
                interest_type: string;
            };
            receipts: {
                receipt_date: string;
                amount: number;
            }[];
        }) | null
    >(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            receiptDate: new Date().toISOString().split("T")[0], // Today's date
            transactionDate: new Date().toISOString().split("T")[0], // Today's date for transaction
            receiptNumber: societyData.receipt_no,
            amount: 0,
            transactionId: "",
            bankName: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            if (!billDetails) return;

            const receiptData = {
                id_tenant: billDetails.id_tenant,
                id_society: societyData.id,
                id_member_bill: billDetails.id,
                id_book_master: values.bookId,
                receipt_number: values.receiptNumber,
                receipt_date: values.receiptDate,
                amount: values.amount,
                mode_of_payment: values.modeOfPayment,
                mode_txn_date: values.transactionDate || "",
                mode_bank_name: values.bankName || "",
            };

            await createReceiptInDb(receiptData, billDetails, societyData.code);

            toast({
                title: "Receipt Created",
                description:
                    `Receipt #${values.receiptNumber} created successfully`,
                variant: "default",
                duration: 3000,
            });

            // Reset form and states
            form.reset();
            setBillDetails(null);
            setSelectedMember(null);

            router.refresh();
        } catch (error) {
            console.error("Error creating receipt:", error);
            toast({
                title: "Error",
                description: "Failed to create receipt. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleMemberSelect = async (memberId: number) => {
        const member = members.find((m) => m.id === memberId);
        setSelectedMember(member || null);

        // Get member's last bill details
        try {
            if (member) {
                const response = await getMemberBillsByMemberId(member?.id);
                if (response) {
                    setBillDetails(response as any);
                }
            } else setBillDetails(null);
        } catch (error) {
            console.error("Error fetching bill details:", error);
        }
    };

    return (
        <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Section - Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Receipt Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {/* Member and Book Selection Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="memberId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Member</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(
                                                        parseInt(value),
                                                    );
                                                    handleMemberSelect(
                                                        parseInt(value),
                                                    );
                                                }}
                                                defaultValue={field.value
                                                    ?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select member" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {members.map((member) => (
                                                        <SelectItem
                                                            key={member.id}
                                                            value={member.id
                                                                .toString()}
                                                        >
                                                            {member.full_name}
                                                            {" "}
                                                            ({member.flat_no})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bookId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Book</FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(
                                                        parseInt(value),
                                                    )}
                                                defaultValue={field.value
                                                    ?.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select book" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {books.map((book) => (
                                                        <SelectItem
                                                            key={book.id}
                                                            value={book.id
                                                                .toString()}
                                                        >
                                                            {book.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Receipt Number and Date Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="receiptNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Receipt Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseInt(
                                                                e.target.value,
                                                            ),
                                                        )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="receiptDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Receipt Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Amount and Payment Mode Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value,
                                                            ),
                                                        )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="modeOfPayment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Mode</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment mode" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cash">
                                                        Cash
                                                    </SelectItem>
                                                    <SelectItem value="check_book">
                                                        Cheque
                                                    </SelectItem>
                                                    <SelectItem value="upi">
                                                        UPI
                                                    </SelectItem>
                                                    <SelectItem value="net_banking">
                                                        Net Banking
                                                    </SelectItem>
                                                    <SelectItem value="card">
                                                        Card
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Transaction Details (Conditional) */}
                            {form.watch("modeOfPayment") !== "cash" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="transactionId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Transaction ID
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="transactionDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Transaction Date
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="date"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bank Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Receipt"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Right Section - Bill Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Bill Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {selectedMember
                        ? (
                            <div className="space-y-6">
                                {/* Member Header */}
                                <div className="border-b pb-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-semibold">
                                            {selectedMember.full_name}
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                {selectedMember.code}
                                            </span>
                                        </h2>
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                                            Active
                                        </span>
                                    </div>
                                    <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <span className="h-4 w-4">🏠</span>
                                            <span>
                                                Flat {selectedMember.flat_no}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-4 w-4">📧</span>
                                            <span>{selectedMember.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="h-4 w-4">📞</span>
                                            <span>
                                                {selectedMember.mobile}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* User and Bill Information Grid */}
                                <div className="grid  gap-6">
                                    {/* Bill Information */}
                                    {billDetails && (
                                        <div className="mt-4 space-y-4">
                                            <h3 className="text-sm font-medium">
                                                Bill Information
                                            </h3>
                                            <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Bill Frequency:
                                                    </span>
                                                    <p className="font-medium">
                                                        {billDetails
                                                            .society_bills
                                                            .bill_frequency}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Bill Lot:
                                                    </span>
                                                    <p className="font-medium">
                                                        {billDetails.bill_lot}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Bill Date:
                                                    </span>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            billDetails
                                                                .society_bills
                                                                .bill_date,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Due Date:
                                                    </span>
                                                    <p className="font-medium">
                                                        {formatDate(
                                                            billDetails
                                                                .society_bills
                                                                .due_date,
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Interest Period:
                                                    </span>
                                                    <p className="font-medium">
                                                        {billDetails
                                                            .society_bills
                                                            .interest_period}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Credit Adjust:
                                                    </span>
                                                    <p className="font-medium">
                                                        {billDetails
                                                            .society_bills
                                                            .credit_adj_first}
                                                    </p>
                                                </div>
                                            </div>
                                            <Separator />
                                        </div>
                                    )}
                                </div>

                                {/* Bill Amount Details */}
                                {billDetails && (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm py-1">
                                                <span className="text-muted-foreground">
                                                    Bill Amount
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        billDetails.bill_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm py-1">
                                                <span className="text-muted-foreground">
                                                    Principle Arrears
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        billDetails
                                                            .principle_arrears,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm py-1">
                                                <span className="text-muted-foreground">
                                                    Interest Arrears
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        billDetails
                                                            .interest_arrears,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm py-1">
                                                <span className="text-muted-foreground">
                                                    Interest
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        billDetails
                                                            .interest_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm py-1">
                                                <span className="text-muted-foreground">
                                                    Total Bill Amount
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        billDetails
                                                            .total_bill_amount,
                                                    )}
                                                </span>
                                            </div>
                                            <Separator />
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">
                                                Payment History
                                            </h4>
                                            {billDetails.receipts.length > 0
                                                ? (
                                                    <div className="space-y-2">
                                                        {billDetails.receipts
                                                            .map((
                                                                receipt,
                                                                index,
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex justify-between items-center text-sm py-1 bg-muted/50 px-3 rounded-md"
                                                                >
                                                                    <div className="space-y-1">
                                                                        <span className="text-muted-foreground">
                                                                            {formatDate(
                                                                                receipt
                                                                                    .receipt_date,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-medium">
                                                                        {formatCurrency(
                                                                            receipt
                                                                                .amount,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        <div className="flex justify-between items-center text-sm pt-2">
                                                            <span className="font-medium">
                                                                Total Paid
                                                            </span>
                                                            <span className="font-medium">
                                                                {formatCurrency(
                                                                    billDetails
                                                                        .receipts
                                                                        .reduce(
                                                                            (
                                                                                sum,
                                                                                receipt,
                                                                            ) => sum +
                                                                                receipt
                                                                                    .amount,
                                                                            0,
                                                                        ),
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                                : (
                                                    <div className="text-sm text-muted-foreground py-2">
                                                        No payments recorded
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                        : (
                            <div className="text-center py-8 text-muted-foreground">
                                Select a member to view bill details
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
}
