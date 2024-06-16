const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: "./src/api",
});

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const match = router.match(req);

    if (!match) {
      return new Response("Not found", { status: 404 });
    }

    const api = require(match.filePath);
    return api.fetch(req);
  },
});

console.log(`Listening on localhost:${server.port}`);
