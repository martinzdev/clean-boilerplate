import { Controller, Get } from "@nestjs/common";

@Controller("ping")
export class PingController {
  @Get()
  async handler() {
    return "pong";
  }
}
