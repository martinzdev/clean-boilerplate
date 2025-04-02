import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { HasherService } from "@/modules/identity/application/ports/services/hasher-service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { SessionFactory } from "test/factories/make-session";
import { UserFactory } from "test/factories/make-user";
import { CryptographyModule } from "../../services/cryptography/cryptography.module";

describe("Reauthenticate (E2E)", () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let sessionFactory: SessionFactory;
  let hasherService: HasherService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CryptographyModule],
      providers: [UserFactory, SessionFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    sessionFactory = moduleRef.get(SessionFactory);
    hasherService = moduleRef.get(HasherService);

    await app.init();
  });

  test("[POST] /auth/refresh", async () => {
    const user = await userFactory.makeTypeOrmUser({
      email: "johndoe@gmail.com",
      password: await hasherService.hash("123456"),
    });

    const session = await sessionFactory.makeTypeOrmSession({
      userId: user.id.toString(),
    });

    console.log(`User ID: ${user.id}`);
    console.log(`Session ID: ${session.id}`);
    console.log(`Session User ID: ${session.userId}`);
    console.log(`Session Refresh Token: ${session.refreshToken}`);

    const response = await request(app.getHttpServer())
      .post("/auth/refresh")
      .send({
        refreshToken: session.refreshToken,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
