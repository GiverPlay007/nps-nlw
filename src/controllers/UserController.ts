import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;
    
    const usersRepository = getCustomRepository(UsersRepository);
    
    const userAlreadExists = await usersRepository.findOne({
      email
    });

    if(userAlreadExists) {
      return response.status(400).json({
        error: "User already exists!"
      });
    }

    const user = usersRepository.create({
      name, email
    });

    await usersRepository.save(user);

    return response.status(201).send(user);
  }
}

export { UserController };