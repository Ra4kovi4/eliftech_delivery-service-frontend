import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getTotalPrice, isValidOrderForm } from "../../helpers";
import { OrderForm } from "../../components/OrderForm";
import { OrderedDish } from "../../components/OrderedDish";
import { sendOrder } from "../../api";

import css from "./Cart.module.css";

const Cart = () => {
	const formData = new FormData();

	const [orderData, setOrderData] = useState([]);

	useEffect(() => {
		const storedDishes = JSON.parse(localStorage.getItem("dishes")) || [];

		setOrderData(storedDishes);

		const handleStorageChange = (event) => {
			if (event.key === "dishes") {
				const storedDishes = JSON.parse(event.newValue) || [];
				setOrderData(storedDishes);
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, []);

	const handleButtonClick = (id) => {
		const updatedDishes = orderData.filter((dish) => dish.id !== id);
		setOrderData(updatedDishes);
		localStorage.setItem("dishes", JSON.stringify(updatedDishes));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			formData.get("name") === null ||
			formData.get("address") === null ||
			formData.get("email") === null ||
			formData.get("phone") === null
		) {
			toast.info("Please fill all fields and choose dishes");
			return;
		}
		if (orderData.length === 0) {
			toast.info("Please choose dishes");
			return;
		}
		try {
			const requestData = {
				name: formData.get("name"),
				email: formData.get("email"),
				address: formData.get("address"),
				phone: formData.get("phone"),
				dishes: orderData,
				totalPrice: getTotalPrice(orderData),
			};

			const { isValid } = isValidOrderForm(requestData);

			if (!isValid) {
				return;
			} else {
				await sendOrder(requestData).then(() => {
					toast.info("Your order was successful");
				});
				localStorage.removeItem("dishes");
				setOrderData([]);
			}
		} catch (error) {
			toast.warn("Oops! Something went wrong");
			console.log(error.message);
		}
	};

	return (
		<main className={css.page_container}>
			<button className={css.submit_button} onClick={(e) => handleSubmit(e)}>
				Place an order
			</button>
			<div className={css.content_wrapper}>
				<OrderForm formData={formData} />
				<OrderedDish
					orderedDish={orderData}
					handleButtonClick={handleButtonClick}
					setOrderedDish={setOrderData}
				/>
			</div>

			<ToastContainer autoClose={2000} />
		</main>
	);
};
export default Cart;
