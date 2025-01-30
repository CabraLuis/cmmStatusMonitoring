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
      workOrder: workOrder.workOrder,
      quantity: parseInt(workOrder.quantity),
      stepId: newStep.id,
      deliveredBy: newArea.id,
      receivedAt: fromDateToString(new Date(workOrder.receivedAt)),
      priorityId: parseInt(workOrder.priority),
      statusId: 1,
      estimatedTime: parseInt(workOrder.estimatedTime),
      rejected: false,
    },
  });

  await prisma.workOrderStatusRegistry.create({
    data: {
      workOrderId: newWorkOrder.id,
      statusId: newWorkOrder.statusId,
      startedAt: newWorkOrder.receivedAt,
      rejected: newWorkOrder.rejected,
      elapsedTime: 0,
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
      partStatusRegistry: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return new Response(JSON.stringify(workOrders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  const { workOrder, rejected, statusId } = await request.json();

  function fromDateToString(date: Date) {
    date = new Date(+date);
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
    let dateAsString = date.toISOString();
    return dateAsString;
  }

  const updatedWorkOrder = await prisma.workOrder.update({
    where: { workOrder: workOrder },
    data: {
      statusId: parseInt(statusId),
      rejected: rejected,
    },
    include: { partStatusRegistry: true },
  });

  if (updatedWorkOrder) {
    const regUpdate = await prisma.workOrderStatusRegistry.create({
      data: {
        workOrderId: updatedWorkOrder.id,
        startedAt: fromDateToString(new Date(Date.now())),
        statusId: updatedWorkOrder.statusId,
        rejected: updatedWorkOrder.rejected,
        elapsedTime: 0,
      },
    });

    // NO PUEDE SER EL REGISTRO PREVIO

    const prevWOReg = await prisma.workOrderStatusRegistry.updateManyAndReturn({
      where: {
        workOrderId: updatedWorkOrder.id,
        statusId: parseInt(statusId) - 1,
      },
      data: {
        elapsedTime: Math.round(
          (new Date(Date.now()).getTime() -
            new Date(Date.now()).getTimezoneOffset() * 60000 -
            new Date(updatedWorkOrder.receivedAt).valueOf()) /
            1000 /
            60
        ),
      },
    });

    if (statusId === 3) {
      await prisma.workOrder.update({
        where: { workOrder: workOrder },
        data: {
          timeDelayed: Math.round(
            (regUpdate.startedAt.getTime() - prevWOReg[0].startedAt.getTime()) /
              60000 -
              updatedWorkOrder.estimatedTime
          ),
        },
      });
    }
  }

  await prisma.workOrder.update({
    where: { workOrder: workOrder },
    data: {
      receivedAt: fromDateToString(new Date(Date.now())),
    },
    include: { partStatusRegistry: true },
  });

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};
