import { StrictMode } from "react";

import { MaxUI } from "@maxhub/max-ui";
import { createRoot } from "react-dom/client";

import "./setupDevMode";
import "virtual:svg-icons-register";

import App from "./App";
import {HistoryProvider} from "@contexts/HistoryContext";

import "./styles/main.scss";
import "@maxhub/max-ui/dist/styles.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
	  <HistoryProvider>
		  <MaxUI>
			  <App />
		  </MaxUI>
	  </HistoryProvider>
	</StrictMode>,
);
