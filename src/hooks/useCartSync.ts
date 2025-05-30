import { useEffect } from "react";

export function useCartSync(cart: any[], user: any) {
  useEffect(() => {
    if (!user?.id || !cart?.length) return;

    const syncCart = async () => {
      try {
        // Replace with your backend cart API endpoint
        const res = await fetch("http://localhost:8080/api/cart/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // If you need auth, add Authorization header here
          },
          body: JSON.stringify({
            userId: user.id,
            items: cart.map(item => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        });

        if (!res.ok) throw new Error("Sync failed");
        localStorage.removeItem("cartSyncError");
      } catch (err) {
        localStorage.setItem("cartSyncError", "true");
      }
    };

    syncCart();
  }, [cart, user]);
} 