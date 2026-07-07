"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Prisma } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const screenSchema = z.object({
  name: z.string().min(2).max(80),
  filters: z.record(z.unknown())
});

const researchRunSchema = z.object({
  name: z.string().min(2).max(80),
  strategy: z.enum(["MOVING_AVERAGE", "RSI", "MACD", "MOMENTUM", "FACTOR"]),
  universe: z.string().min(1).max(80),
  parameters: z.record(z.unknown()),
  metrics: z.record(z.unknown()),
  equityCurve: z.array(z.record(z.unknown()))
});

export async function saveScreenAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Sign in to save screens." };
  }

  const parsed = screenSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid screen filters." };
  }

  await prisma.savedScreen.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      filters: parsed.data.filters as Prisma.InputJsonValue
    }
  });

  revalidatePath("/screener");
  return { ok: true, message: "Screen saved." };
}

export async function saveResearchRunAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Sign in to save research runs." };
  }

  const parsed = researchRunSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Invalid research run." };
  }

  await prisma.researchRun.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      strategy: parsed.data.strategy,
      universe: parsed.data.universe,
      parameters: parsed.data.parameters as Prisma.InputJsonValue,
      metrics: parsed.data.metrics as Prisma.InputJsonValue,
      equityCurve: parsed.data.equityCurve as Prisma.InputJsonValue[]
    }
  });

  revalidatePath("/research-lab");
  return { ok: true, message: "Research run saved." };
}
