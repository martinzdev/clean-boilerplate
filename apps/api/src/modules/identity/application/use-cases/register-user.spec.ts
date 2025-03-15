import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { FakeHasher } from "test/services/fake-hasher.service";
import { RegisterUserUseCase } from "./register-user";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let sut: RegisterUserUseCase;

describe("Register User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher);
  });

  it("should register a new user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUserRepository.users[0],
    });
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryUserRepository.users[0].password).toEqual(hashedPassword);
  });
});
