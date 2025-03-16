import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { UserEntity } from "@/infra/database/typeorm/entities/user.entity";
import { faker } from "@faker-js/faker";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { Repository } from "typeorm";
import { CryptographyModule } from "../../services/cryptography/cryptography.module";

describe("Register user (E2E)", () => {
  let app: INestApplication;
  let userRepository: Repository<UserEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();
    userRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity)
    );

    await app.init();
  });

  test("[POST] /auth/signup", async () => {
    const userName = faker.person.fullName();
    const userEmail = "johndoe@gmail.com";

    const response = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        name: userName,
        email: userEmail,
        password: "123456",
      });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await userRepository.findOne({
      where: {
        email: userEmail,
      },
    });

    expect(userOnDatabase).toBeTruthy();
    expect(userOnDatabase?.name).toBe(userName);
    expect(userOnDatabase?.email).toBe(userEmail);
  });
});
