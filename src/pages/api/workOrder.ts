import type { APIRoute } from "astro";
import CMMController from "../controller";
import { prisma } from "../../lib/prisma";

export const POST: APIRoute = async ({ request }) => {
  const { workOrder } = await request.json();
  const newPart = await prisma.part.upsert({
    where: {
      number: workOrder.part,
    },
    update: {},
    create: {
      number: workOrder.part,
    },
  });

  const newStep = await prisma.step.upsert({
    where: {
      step: parseInt(workOrder.step),
    },
    update: {},
    create: {
      step: parseInt(workOrder.step),
    },
  });

  const newArea = await prisma.area.upsert({
    where: {
      area: workOrder.area,
    },
    update: {},
    create: {
      area: workOrder.area,
    },
  });

  function fromDateToString(date: Date) {
    date = new Date(+date);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    let dateAsString = date.toISOString();
    return dateAsString;
  }

  const newWorkOrder = await prisma.workOrder.create({
    data: {
      partId: newPart.id,
      workOrder: parseInt(workOrder.workOrder),
      quantity: parseInt(workOrder.quantity),
      stepId: newStep.id,
      deliveredBy: newArea.id,
      receivedAt: fromDateToString(new Date(workOrder.receivedAt)),
      priorityId: parseInt(workOrder.priority),
      statusId: 1,
    },
  });

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 204 });
};

export const GET: APIRoute = async () => {
  const workOrders = await prisma.workOrder.findMany({
    include: {
      area: true,
      part: true,
      priority: true,
      status: true,
      step: true,
    },
  });
  console.log(workOrders);
  return new Response(JSON.stringify(workOrders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
