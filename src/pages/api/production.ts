import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";
import { prisma } from "../../lib/prisma";

function fromDateToString(date: Date) {
  date = new Date(+date);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
  let dateAsString = date.toISOString();
  return dateAsString;
}

export const POST: APIRoute = async ({ request,cookies }) => {
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

  cookies.set("area", `${newArea.area}`, { path: "/", maxAge: 34560000 });

  const newWorkOrder = await prisma.workOrder.create({
    data: {
      partId: newPart.id,
      workOrder:
        workOrder.workOrder +
        `@${newStep.id}` +
        `${new Date(Date.now()).getTime()}`,
      quantity: parseInt(workOrder.quantity),
      stepId: newStep.id,
      deliveredBy: newArea.id,
      receivedAt: fromDateToString(new Date(Date.now())),
      priorityId: 3,
      statusId: 1,
      estimatedTime: 0,
      rejected: false,
      beeperId: parseInt(workOrder.beeperId),
      employee: workOrder.employee,
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
  console.log("-----------------------------");
  console.log("NEW WORK ORDER");
  console.log("Date: " + fromDateToString(new Date(Date.now())));
  console.log("WorkOrder No.: " + newWorkOrder.workOrder);
  console.log("WorkOrder ID: " + newWorkOrder.id);
  console.log("-----------------------------");
  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};

export const GET: APIRoute = async () => {
  const workOrders = await prisma.workOrder.findMany({
    take: 18,
    include: {
      area: true,
      part: true,
      priority: true,
      status: true,
      step: true,
      partStatusRegistry: true,
    },
    orderBy: {
      receivedAt: "desc",
    },
  });

  return new Response(JSON.stringify(workOrders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  const { workOrder, priorityId } = await request.json();
  const updatedWorkOrder = await prisma.workOrder.update({
    where: { workOrder: workOrder.workOrder },
    data: {
      priorityId: parseInt(priorityId),
    },
    include: { partStatusRegistry: true },
  });

  console.log("-----------------------------");
  console.log("PATCHED WORK ORDER");
  console.log("Date: " + fromDateToString(new Date(Date.now())));
  console.log("WorkOrder No.: " + updatedWorkOrder.workOrder);
  console.log("WorkOrder ID: " + updatedWorkOrder.id);
  console.log("Changed priority: " + priorityId);
  console.log("-----------------------------");

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};
