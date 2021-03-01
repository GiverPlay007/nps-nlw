import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { Request, Response } from "express";
import * as yup from "yup";
import { AppError } from "./errors/AppError";

class NpsController {
  async execute(request: Request, response: Response) {

    const schema = yup.object().shape({
      name: yup.string().required("Name is required!"),
      email: yup.string().email().required("Email is required!")
    });
    
    try {
      schema.validate(request.body, { abortEarly: false })
    } 
    catch (error) {
      throw new AppError(error.message);
    }

    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });
    
    const totalAnswers = surveysUsers.length;

    const detractors = surveysUsers.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;
    const passives = surveysUsers.filter(survey => (survey.value >= 7 && survey.value <= 8)).length;
    const promoters = surveysUsers.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;

    const calculate = Number(Number(((promoters - detractors) / totalAnswers) * 100).toFixed(2));

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate
    });
  }
}

export { NpsController };