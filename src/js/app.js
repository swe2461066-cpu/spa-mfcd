import { mountNavbar } from "./components/navbar.js";
import { mountFooter } from "./components/footer.js";
import { initRouter } from "./router.js";
import { routes } from "./routes.js";

mountNavbar(document.getElementById("navbar"));
mountFooter(document.getElementById("footer")); // 2.13.2
initRouter(routes);
