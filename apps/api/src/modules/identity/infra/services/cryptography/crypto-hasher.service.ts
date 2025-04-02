import { HasherService } from "@/modules/identity/application/ports/services/hasher-service";
import { Injectable } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "node:crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class CryptoHasherService implements HasherService {
  private PASSWORD_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    const salt = randomBytes(this.PASSWORD_SALT_LENGTH).toString("hex");
    const hash = (await scrypt(plain, salt, 32)) as Buffer;

    return `${salt}.${hash.toString("hex")}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const [salt, storedHash] = hash.split(".");
    const hashBuffer = (await scrypt(plain, salt, 32)) as Buffer;

    return storedHash === hashBuffer.toString("hex");
  }
}
