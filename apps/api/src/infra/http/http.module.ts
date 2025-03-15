import { Module } from "@nestjs/common";
import { PingController } from "./controllers/ping.controller";

@Module({
  controllers: [PingController],
  providers: [],
})
export class HttpModule {}
