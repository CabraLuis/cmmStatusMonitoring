import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";
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
      estimatedTime: parseInt(workOrder.estimatedTime),
    },
  });

  const newRegistryEntry = await prisma.workOrderStatusRegistry.create({
    data: {
      workOrderId: newWorkOrder.id,
      statusId: newWorkOrder.statusId,
      startedAt: newWorkOrder.receivedAt,
      rejected: false,
    },
  });

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
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

  return new Response(JSON.stringify(workOrders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const UPDATE: APIRoute = async ({ request }) => {
  const { workOrder } = await request.json();

  function fromDateToString(date: Date) {
    date = new Date(+date);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    let dateAsString = date.toISOString();
    return dateAsString;
  }

  const updatedWorkOrder = await prisma.workOrder.update({
    where: { workOrder: workOrder.workOrder },
    data: {
      statusId: workOrder.statusId,
    },
    include: { partStatusRegistry: true },
  });

  const newRegistryEntry = await prisma.workOrderStatusRegistry.create({
    data: {
      workOrderId: updatedWorkOrder.id,
      startedAt: fromDateToString(new Date(Date.now())),
      statusId: updatedWorkOrder.statusId,
      rejected: workOrder.rejected,
    },
  });

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};
