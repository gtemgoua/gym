/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const hashPassword = async (password: string) =>
  argon2.hash(password);

const main = async () => {
  console.log("🌱 Seeding database...");
  const password = await hashPassword("ChangeMe123!");

  const owner = await prisma.user.upsert({
    where: { email: "owner@gym.test" },
    update: {},
    create: {
      name: "Demo Owner",
      email: "owner@gym.test",
      passwordHash: password,
      role: "OWNER",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "coach@gym.test" },
    update: {},
    create: {
      name: "Coach Carter",
      email: "coach@gym.test",
      passwordHash: password,
      role: "STAFF",
      staffProfile: {
        create: {
          bio: "Certified level 2 coach.",
          payRate: 30,
        },
      },
    },
  });

  const planMonthly = await prisma.plan.upsert({
    where: { id: "monthly-plan" },
    update: {},
    create: {
      id: "monthly-plan",
      name: "Unlimited Monthly",
      price: 159,
      billingPeriod: "MONTHLY",
      creditsPerPeriod: null,
      contractMonths: 12,
      cancellationPolicy: "30-day notice required",
    },
  });

  const planPunch = await prisma.plan.upsert({
    where: { id: "punch-card-plan" },
    update: {},
    create: {
      id: "punch-card-plan",
      name: "10-Class Punch Card",
      price: 199,
      billingPeriod: "DROP_IN",
      creditsPerPeriod: 10,
      contractMonths: null,
      cancellationPolicy: "Non-refundable after first use",
    },
  });

  const memberPromises = Array.from({ length: 20 }).map((_, index) =>
    prisma.user.upsert({
      where: { email: `member${index + 1}@gym.test` },
      update: {},
      create: {
        name: `Member ${index + 1}`,
        email: `member${index + 1}@gym.test`,
        passwordHash: password,
        role: "MEMBER",
        memberProfile: {
          create: {
            status: index % 5 === 0 ? "TRIAL" : "ACTIVE",
          },
        },
      },
    }),
  );

  const members = await Promise.all(memberPromises);

  await prisma.subscription.createMany({
    data: members.slice(0, 10).map((member) => ({
      memberId: member.id,
      planId: planMonthly.id,
      status: "ACTIVE",
      startDate: new Date(),
    })),
  });

  await prisma.messageTemplate.createMany({
    data: [
      {
        key: "welcome",
        channel: "EMAIL",
        subject: "Welcome to the studio!",
        body: "Hi {{name}}, welcome aboard.",
      },
      {
        key: "failed_payment",
        channel: "EMAIL",
        subject: "Payment issue",
        body: "We could not process your recent payment.",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.classTemplate.create({
    data: {
      name: "Morning Conditioning",
      defaultCoachId: staff.id,
      defaultCapacity: 20,
      defaultDuration: 60,
      creditCost: 1,
      location: "Main Box",
    },
  });

  console.log("✅ Seed completed for owner:", owner.email);
};

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
