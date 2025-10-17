import { IncomingMessage, request, ServerResponse } from "http";
import { getSongById, getSongs, addSong } from "../controllers/Songs";
import { error } from "console";
import { title } from "process";

//http://localhost:3000/songs - songs endpoint
//check if incoming request start with the songs endpoint
export const songsRoute = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.url?.startsWith("/songs")) {
    const parts = req.url.split("/");
    console.log(parts, "url parts");

    const id = parts[2] ? parseInt(parts[2]) : undefined;

    if (req.method === "GET" && !id) {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(getSongs()));
      return;
    }

    if (req.method === "GET" && id) {

      if (isNaN(id)) {
        res.writeHead(400, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid song id" }));
        return;
      }
      const song = getSongById(id);
      if (!song) {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "Song not found" }));
        return;
      }
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(song));
      return;
    }

    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        console.log(chunk, "chunk");
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const { title, artist, duration } = JSON.parse(body);
          if (!title || typeof title !== "string") {
            res.writeHead(400, { "content-type": "application/lson" });
            res.end(JSON.stringify({ error: "Song title is required" }));
          }

          if (!artist || typeof artist !== "string") {
            res.writeHead(400, { "content-type": "application/lson" });
            res.end(JSON.stringify({ error: "Song artist is required" }));
          }

          if (!duration || typeof duration !== "number") {
            res.writeHead(400, { "content-type": "application/lson" });
            res.end(JSON.stringify({ error: "Song duration is required" }));
          }

          const newSong = addSong(title, artist, duration);
          res.writeHead(201, { "content-type": "application/json" });
          res.end(JSON.stringify(newSong));
        } catch (error) {
          res.writeHead(400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON payload" }));
        }
      });
      return;
    }
    res.writeHead(405, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed on /songs" }));
  }
};
