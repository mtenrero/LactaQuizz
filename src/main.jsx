import React from "react";
import ReactDOM from "react-dom/client";
import Quizizz from './pages/Quizziz/Quizizz.jsx';
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ThemeProvider>
			<Quizizz />
		</ThemeProvider>
	</React.StrictMode>
);
