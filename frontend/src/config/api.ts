const isDev = import.meta.env.DEV;

export const SSL: boolean = false;

const HOST_PROD: string = "reassel.com";

const HOST_DEV: string = "localhost";
const PORT_DEV: number = 8000;

export const PORT = isDev ? `:${PORT_DEV}` : "";
export const HOST = isDev ? HOST_DEV : HOST_PROD;

const PROTOCOL = `http${isDev ? "" : "s"}://`;

export const API_URL = `${PROTOCOL}${HOST}${PORT}/api`;
