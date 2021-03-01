import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { getCustomRepository } from "typeorm";
import { Response, Request } from "express";
import { resolve } from "path";
 
import SendMailService from "../services/SendMailService";
import { AppError } from "./errors/AppError";

class SendMailController {

  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const usersRepository = getCustomRepository(UsersRepository);

    const user = await usersRepository.findOne({ email });

    if(!user) {
      throw new AppError("User does not exists");
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if(!survey) {
      throw new AppError("Survey does not exists");
    }
    
    const path = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserExists = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value: null},
      relations: ["user", "survey"]
    });

    const variables = {
      name: user.name,
      id: "",
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL
    }

    if(surveyUserExists) {
      variables.id = surveyUserExists.id;
      await SendMailService.execute(email, survey.title, variables, path);
      return response.json(surveyUserExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    variables.id = surveyUser.id;
    await SendMailService.execute(email, survey.title, variables, path);

    return response.status(201).send(surveyUser);
  }
}

export { SendMailController };