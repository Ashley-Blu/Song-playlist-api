import http, { IncomingMessage, ServerResponse } from "http";
import { songsRoute } from "./routes/Songs";

const PORT = 3000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {

  if (req.url?.startsWith("/songs")) {
    songsRoute(req, res);
  } else {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Hellow world!" }));
  }
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
