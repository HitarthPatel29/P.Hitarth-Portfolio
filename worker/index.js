"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    fetch: function (request) {
        var url = new URL(request.url);
        if (url.pathname === "/api/health") {
            return Response.json({ ok: true, runtime: "cloudflare-workers" });
        }
        return new Response(null, { status: 404 });
    },
};
