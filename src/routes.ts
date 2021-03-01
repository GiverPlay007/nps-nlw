import { SendMailController } from "./controllers/SendMailController";
import { AnswerController } from "./controllers/AnswerController";
import { SurveyController } from "./controllers/SurveyController";
import { UserController } from "./controllers/UserController";
import { NpsController } from "./controllers/NpsController";
import { Router } from "express";

const router = Router();

const sendMailController = new SendMailController();
const surveyController = new SurveyController();
const answerController = new AnswerController();
const userController = new UserController();
const npsController = new NpsController();

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendmail", sendMailController.execute);
router.post("/users", userController.create);

router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };