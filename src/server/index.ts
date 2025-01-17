import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { webhookCallback } from "grammy";
import type { Bot } from "#root/bot/index.js";
import { logger } from "#root/logger.js";

export const createServer = async (bot: Bot) => {
  const server = fastify({
    logger,
  });
  server.addHook('onRequest', async (request, reply) => {
    reply.header('Cross-Origin-Resource-Policy', 'cross-origin');
  });

  server.register(cors);
  server.register(helmet);

  server.setErrorHandler(async (error, request, response) => {
    logger.error(error);

    await response.status(500).send({ error: "Oops! Something went wrong." });
  });

  server.get("/", () => ({ status: true }));

  server.post(`/${bot.token}`, webhookCallback(bot, "fastify"));

  return server;
};
