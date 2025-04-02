import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { HasherService } from "@/modules/identity/application/ports/services/hasher-service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/make-user";
import { CryptographyModule } from "../../services/cryptography/cryptography.module";

describe("Authenticate (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let hasherService: HasherService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    hasherService = moduleRef.get(HasherService);

    await app.init();
  });

  test("[POST] /auth/signin", async () => {
    await userFactory.makeTypeOrmUser({
      email: "johndoe@gmail.com",
      password: await hasherService.hash("123456"),
    });

    const response = await request(app.getHttpServer())
      .post("/auth/signin")
      .send({
        email: "johndoe@gmail.com",
        password: "123456",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
