import { useCartSync } from "../../hooks/useCartSync";
import { useSelector } from "react-redux";
import { RootState } from "../../store"; // adjust the path as needed

const cart = useSelector((state: any) => state.cart.items);
const user = useSelector((state: any) => state.auth.user);

useCartSync(cart, user); 