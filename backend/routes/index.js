import userRouter from "./UserRoutes.js";
const routes = (app) => {
  app.get("/api/user", userRouter);
};
export default routes;
