import { useCartSync } from "../../hooks/useCartSync";

const cart = useSelector(state => state.cart.items); // or however you get cart
const user = useSelector(state => state.auth.user);  // or however you get user

useCartSync(cart, user); 