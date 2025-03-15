import { makeSession } from "test/factories/make-session";
import { makeUser } from "test/factories/make-user";
import { InMemorySessionRepository } from "test/repositories/in-memory-session.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { FakeEncrypter } from "test/services/fake-encrypter.service";
import { FakeHasher } from "test/services/fake-hasher.service";
import { AuthenticateInvalidTokenException } from "../exceptions/AuthenticateInvalidTokenException";
import { ReauthenticateUserUserCase } from "./reauthenticate-user";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemorySessionRepository: InMemorySessionRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: ReauthenticateUserUserCase;

describe("Reauthenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemorySessionRepository = new InMemorySessionRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new ReauthenticateUserUserCase(
      inMemoryUserRepository,
      inMemorySessionRepository,
      fakeEncrypter
    );
  });

  it("should be able to reauthenticate user", async () => {
    const user = makeUser({
      email: "johndoe@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    const session = await makeSession({ userId: user.id.toString() });

    await inMemoryUserRepository.save(user);
    await inMemorySessionRepository.save(session);

    const result = await sut.execute({
      refreshToken: session.refreshToken,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it("should not be able to reauthenticate user with invalid refresh token", async () => {
    const user = makeUser({
      email: "johndoe@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    const session = await makeSession({ userId: user.id.toString() });

    await inMemoryUserRepository.save(user);
    await inMemorySessionRepository.save(session);

    await sut.execute({
      refreshToken: session.refreshToken,
    });

    const result = await sut.execute({
      refreshToken: session.refreshToken,
    });

    expect(result.isRight()).toBe(false);
    expect(result.value).toBeInstanceOf(AuthenticateInvalidTokenException);
  });
});
