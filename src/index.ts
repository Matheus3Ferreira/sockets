import { serverHttp } from "./http";
import "./websocket";

serverHttp.listen(3000, () => console.log('listening on http://localhost:3000'));