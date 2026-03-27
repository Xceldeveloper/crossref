import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { logger } from "./utils/logger";
import "./assets/scss/global.scss";

const app = createApp(App);

app.config.errorHandler = (err, _instance, info) => {
  logger.error(`[Global Error] ${info}:`, err);
};

app.use(router);
app.mount("#app");
