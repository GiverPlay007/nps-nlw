import { SendMailController } from "./controllers/SendMailController";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";
import { Router } from "express";

const router = Router();

const sendMailController = new SendMailController();
const surveyController = new SurveyController();
const userController = new UserController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendmail", sendMailController.execute);

export { router };