'use server'

import prisma from './prisma'
import { revalidatePath } from 'next/cache'

export async function getCustomers() {
  return await prisma.customer.findMany({
    include: { projects: true },
    orderBy: { name: 'asc' }
  })
}

export async function createCustomer(formData: FormData) {
  const name = formData.get('name') as string
  const contact = formData.get('contact') as string | null

  if (!name) throw new Error('Customer name is required')

  await prisma.customer.create({
    data: { name, contact }
  })

  revalidatePath('/')
}

// export async function getProjects() {
//   return await prisma.project.findMany({
//     include: { customer: true, schedules: true },
//     orderBy: { createdAt: 'desc' }
//   })
// }

export async function getProjects(page: number = 1, limit: number | 'all' = 10) {
  const pageNumber = Math.max(1, page);
  const take = limit === 'all' ? undefined : Number(limit);
  const skip = limit === 'all' ? 0 : (pageNumber - 1) * Number(limit);
  const [projects, totalCount] = await Promise.all([
    prisma.project.findMany({
      ...(limit !== 'all' && { skip, take }),
      include: { customer: true, schedules: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count()
  ]);
  return {
    projects,
    totalPages: limit === 'all' ? 1 : Math.ceil(totalCount / Number(limit)),
    totalCount
  };
}

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string
  const customerId = formData.get('customerId') as string
  const usersStr = formData.get('numberOfUsersForBilling') as string
  const numberOfUsersForBilling = usersStr ? parseInt(usersStr) : 1

  if (!name || !customerId) throw new Error('Name and Customer ID are required')

  await prisma.project.create({
    data: { name, customerId, numberOfUsersForBilling }
  })

  revalidatePath('/')
}

export async function getCategorizedSchedules(resourceId?: string) {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const whereClause: any = { status: 'pending' }
  if (resourceId) {
    whereClause.resourceId = resourceId
  }

  const allPending = await prisma.schedule.findMany({
    where: whereClause,
    include: {
      project: { include: { customer: true } },
      resource: true
    },
    orderBy: { date: 'asc' }
  })

  const overdue = allPending.filter(s => s.date < now)
  const thisWeek = allPending.filter(s => s.date >= now && s.date <= nextWeek)
  const upcoming = allPending.filter(s => s.date > nextWeek)

  return { overdue, thisWeek, upcoming }
}

export async function createSchedule(formData: FormData) {
  const projectId = formData.get('projectId') as string
  const type = formData.get('type') as string
  const category = formData.get('category') as string
  const dateStr = formData.get('date') as string
  const date = new Date(dateStr)
  const startDateStr = formData.get('startDate') as string
  const startDate = startDateStr ? new Date(startDateStr) : null

  const name = formData.get('name') as string | null
  const moduleName = formData.get('moduleName') as string | null
  const recurrence = (formData.get('recurrence') as string) || 'none'
  const amountStr = formData.get('amount') as string
  const amount = amountStr ? parseFloat(amountStr) : null
  const resourceId = formData.get('resourceId') as string | null

  if (!projectId || !type || !date) throw new Error('Missing schedule fields')
  if (type === 'payment' && !category) throw new Error('Missing schedule fields')
  if (type === 'delivery' && !moduleName) throw new Error('Missing schedule fields')

  await prisma.schedule.create({
    data: { projectId, type, date, name, recurrence, amount, category, startDate, moduleName, status: 'pending', resourceId: resourceId || null }
  })

  revalidatePath('/')
  return { success: true, timestamp: Date.now() }
}

export async function updateSchedule(formData: FormData) {
  const id = formData.get('id') as string
  const projectId = formData.get('projectId') as string
  const type = formData.get('type') as string
  const category = formData.get('category') as string
  const dateStr = formData.get('date') as string
  const date = new Date(dateStr)
  const startDateStr = formData.get('startDate') as string
  const startDate = startDateStr ? new Date(startDateStr) : null

  const name = formData.get('name') as string | null
  const moduleName = formData.get('moduleName') as string | null
  const recurrence = (formData.get('recurrence') as string) || 'none'
  const amountStr = formData.get('amount') as string
  const amount = amountStr ? parseFloat(amountStr) : null
  const resourceId = formData.get('resourceId') as string | null

  if (!id || !projectId || !type || !date) throw new Error('Missing schedule fields')
  if (type === 'payment' && !category) throw new Error('Missing schedule fields')
  if (type === 'delivery' && !moduleName) throw new Error('Missing schedule fields')

  await prisma.schedule.update({
    where: { id },
    data: { projectId, type, name, recurrence, amount, startDate, moduleName, date, category, resourceId: resourceId || null }
  })

  revalidatePath('/')
  return { success: true, timestamp: Date.now() }
}

export async function completeSchedule(scheduleId: string, status: string) {
  const newStatus = status === 'pending' ? 'completed' : 'pending';
  const current = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { status: newStatus, completedAt: newStatus === 'completed' ? new Date() : null },
  })

  if (current.category !== 'Development charges') {
    if (current.recurrence === 'monthly') {
      if (newStatus === 'completed') {
        const nextDate = new Date(current.date)
        nextDate.setMonth(nextDate.getMonth() + 1)
        await prisma.schedule.create({
          data: {
            projectId: current.projectId,
            type: current.type,
            name: current.name,
            recurrence: current.recurrence,
            amount: current.amount,
            date: nextDate,
            startDate: current.startDate,
            moduleName: current.moduleName,
            status: 'pending',
            resourceId: current.resourceId,
            category: current.category
          }
        })
      } else {
        const nextMonthDate = new Date(current.date)
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1)
        await prisma.schedule.deleteMany({
          where: {
            projectId: current.projectId,
            name: current.name,
            type: current.type,
            date: nextMonthDate,
            status: 'pending'
          }
        })
      }
    } else if (current.recurrence === 'annual') {
      if (newStatus === 'completed') {
        const nextDate = new Date(current.date)
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        await prisma.schedule.create({
          data: {
            projectId: current.projectId,
            type: current.type,
            name: current.name,
            recurrence: current.recurrence,
            amount: current.amount,
            date: nextDate,
            startDate: current.startDate,
            moduleName: current.moduleName,
            status: 'pending',
            resourceId: current.resourceId,
            category: current.category
          }
        })
      } else {
        const nextYearDate = new Date(current.date)
        nextYearDate.setFullYear(nextYearDate.getFullYear() + 1)
        await prisma.schedule.deleteMany({
          where: {
            projectId: current.projectId,
            name: current.name,
            type: current.type,
            date: nextYearDate,
            status: 'pending'
          }
        })
      }
    }
  }

  revalidatePath('/')
}

export async function deleteSchedule(scheduleId: string) {
  await prisma.schedule.delete({
    where: { id: scheduleId }
  })
  revalidatePath('/projects/[id]', 'page')
  revalidatePath('/')
}

export async function completeScheduleAction(formData: FormData) {
  const scheduleId = formData.get('scheduleId') as string
  const status = formData.get('status') as string
  await completeSchedule(scheduleId, status)
}

export async function deleteScheduleAction(formData: FormData) {
  const scheduleId = formData.get('scheduleId') as string
  await deleteSchedule(scheduleId)
}

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      schedules: {
        include: { resource: true },
        orderBy: [
          { createdAt: 'asc' },
          { type: 'asc' }
        ]
      }
    }
  })
}

export async function updateCustomer(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const contact = formData.get('contact') as string | null

  if (!name) throw new Error('Customer name is required')

  await prisma.customer.update({
    where: { id },
    data: { name, contact }
  })

  revalidatePath('/customers')
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } })
  revalidatePath('/customers')
  revalidatePath('/')
}

export async function updateProject(id: string, formData: FormData, pname?: string, cusId?: string, billUsers?: number) {
  const name = pname ? pname : formData.get('name') as string
  const customerId = cusId ? cusId : formData.get('customerId') as string
  const usersStr = formData.get('numberOfUsersForBilling') as string
  const numberOfUsersForBilling = billUsers ? billUsers : (usersStr ? parseInt(usersStr) : 1)
  const commit_date = formData.get('commit_date') as string;
  const go_live_date = formData.get('go_live_date') as string;
  const amc_date = formData.get('amc_date') as string;

  if (!name) throw new Error('Project name is required')

  await prisma.project.update({
    where: { id },
    data: {
      name,
      customerId,
      numberOfUsersForBilling,
      commit_date: commit_date ? new Date(commit_date) : undefined,
      go_live_date: go_live_date ? new Date(go_live_date) : undefined,
      amc_date: amc_date ? new Date(amc_date) : undefined,
    }
  })
  revalidatePath('/projects')
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/projects')
  revalidatePath('/')
}

export async function getResources(page: number = 1, limit: number | 'all' = 10) {
  const pageNumber = Math.max(1, page);
  const take = limit === 'all' ? undefined : Number(limit);
  const skip = limit === 'all' ? 0 : (pageNumber - 1) * Number(limit);
  const [resources, totalCount] = await Promise.all([
    prisma.resource.findMany({
      ...(limit !== 'all' && { skip, take }),
      orderBy: { name: 'asc' }
    }),
    prisma.resource.count()
  ]);
  return {
    resources,
    totalPages: limit === 'all' ? 1 : Math.ceil(totalCount / Number(limit)),
    totalCount
  };
}

export async function getResource(id: string) {
  return await prisma.resource.findUnique({
    where: { id }
  })
}

export async function createResource(formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string | null

  if (!name) throw new Error('Resource name is required')

  await prisma.resource.create({
    data: { name, role: role || null }
  })

  revalidatePath('/')
  revalidatePath('/resources')
}

export async function updateResource(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const role = formData.get('role') as string | null

  if (!name) throw new Error('Resource name is required')

  await prisma.resource.update({
    where: { id },
    data: { name, role: role || null }
  })

  revalidatePath('/')
  revalidatePath('/resources')
}

export async function deleteResource(id: string) {
  try {
    await prisma.resource.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/resources");
    revalidatePath("/projects");
    return { status: 200, message: "Resource deleted successfully" };
  } catch (error) {
    console.error("Error deleting resource:", error);
    return { status: 500, message: "Failed to delete resource" };
  }
}

export async function getResourcesWithStats() {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        schedules: {
          where: {
            status: "pending",
          },
          include: {
            project: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return resources.map((r) => ({
      ...r,
      pendingCount: r.schedules.length,
      nextDeadline: r.schedules.reduce(
        (min: Date | null, s) =>
          !min || s.date < min ? s.date : min,
        null
      ),
    }));
  } catch (error) {
    console.error("Error getting resources with stats:", error);
    return [];
  }
}

