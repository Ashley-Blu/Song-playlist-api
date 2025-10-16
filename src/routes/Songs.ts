import { IncomingMessage, request, ServerResponse } from "http";
import { getSongById, getSongs, addSong } from "../controllers/Songs";

//http://localhost:3000/songs - songs endpoint
//check if incoming request start with the songs endpoint
export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    console.log(req.url, " url");

    const parts = req.url.split("/");
    console.log(parts, "url parts");

    const id = parts[2] ? parseInt(parts[2]) : undefined;

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getSongs()));
      return;
    }

    if (req.method === "GET" && id) {
      const song = getSongById(id);
      res.writeHead(song ? 200 : 404, { "content-type": "applicaton/json" });
      res.end(JSON.stringify(song || { message: "Not found" }));
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        console.log(chunk, "chunk");
        body += chunk.toString();
        console.log(body, "body");
      });

      req.on("end", () => {
        const { title, artist, duration } = JSON.parse(body);
        const newSong = addSong(title,artist, duration);
        res.writeHead(201, {"content-type":"application/json"})
        res.end(JSON.stringify(newSong));
      });
      return;
    } 
  }
};
