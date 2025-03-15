import { HttpModule } from "./http/http.module";
import { AuthModule } from "./modules/auth/auth.module";

export const IdentityModules = [HttpModule, AuthModule];
