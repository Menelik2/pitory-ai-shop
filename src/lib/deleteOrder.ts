import { supabase } from "@/integrations/supabase/client";

/**
 * Fully remove an order from the database:
 * 1) delete all order_items for this order
 * 2) delete the order row
 */
export async function deleteOrderFromDatabase(orderId: string): Promise<void> {
  // 1) Delete line items first (FK dependency)
  const { error: itemsError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (itemsError) {
    throw new Error(itemsError.message || "Failed to delete order items");
  }

  // 2) Delete the order itself
  const { error: orderError, count } = await supabase
    .from("orders")
    .delete({ count: "exact" })
    .eq("id", orderId);

  if (orderError) {
    throw new Error(orderError.message || "Failed to delete order");
  }

  // RLS can "succeed" with 0 rows deleted if policy blocks — treat as failure
  if (count === 0) {
    throw new Error(
      "Order was not deleted (0 rows). Run supabase/orders_delete_policy.sql in Supabase SQL Editor while logged in as admin."
    );
  }
}
