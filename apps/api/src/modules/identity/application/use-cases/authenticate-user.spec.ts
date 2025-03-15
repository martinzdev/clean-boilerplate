import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { FakeEncrypter } from "test/services/fake-encrypter.service";
import { FakeHasher } from "test/services/fake-hasher.service";
import { AuthenticateUserUseCase } from "./authenticate-user";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter
    );
  });

  it("should be able to authenticate user", async () => {
    const user = makeUser({
      email: "johndoe@gmail.com",
      password: await fakeHasher.hash("123456"),
    });

    await inMemoryUserRepository.save(user);

    const result = await sut.execute({
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
