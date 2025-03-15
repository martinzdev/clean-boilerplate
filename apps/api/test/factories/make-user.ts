import { UniqueEntityID } from "@/@shared/core/entities/unique-entity-id";
import { User, UserProps } from "@/modules/identity/domain/entities/user";
import { faker } from "@faker-js/faker";

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  );

  return user;
}
