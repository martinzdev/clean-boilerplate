import { EncrypterService } from "@/modules/identity/application/ports/services/encrypter-service";
import { HasherService } from "@/modules/identity/application/ports/services/hasher-service";
import { Module } from "@nestjs/common";
import { CryptoHasherService } from "./crypto-hasher.service";
import { JwtEncrypterService } from "./jwt-encrypter.service";

@Module({
  providers: [
    { provide: EncrypterService, useClass: JwtEncrypterService },
    { provide: HasherService, useClass: CryptoHasherService },
  ],
  exports: [HasherService, EncrypterService],
})
export class CryptographyModule {}
