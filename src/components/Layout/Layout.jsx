import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { NavBar } from "../NavBar";

import css from "./Layout.module.css";

export const Layout = () => {
	return (
		<div className={css.container}>
			<NavBar />
			<Suspense fallback={null}>
				<Outlet />
			</Suspense>
		</div>
	);
};
