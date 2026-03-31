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

export async function getProjects() {
  return await prisma.project.findMany({
    include: { customer: true, schedules: true },
    orderBy: { createdAt: 'desc' }
  })
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

export async function getCategorizedSchedules() {
  const now = new Date()
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const allPending = await prisma.schedule.findMany({
    where: { status: 'pending' },
    include: {
      project: { include: { customer: true } }
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
  const dateStr = formData.get('date') as string
  const date = new Date(dateStr)

  const name = formData.get('name') as string | null
  const recurrence = (formData.get('recurrence') as string) || 'none'
  const amountStr = formData.get('amount') as string
  const amount = amountStr ? parseFloat(amountStr) : null

  if (!projectId || !type || !dateStr) throw new Error('Missing schedule fields')

  await prisma.schedule.create({
    data: { projectId, type, date, name, recurrence, amount, status: 'pending' }
  })

  revalidatePath('/')
}

export async function completeSchedule(scheduleId: string) {
  const current = await prisma.schedule.update({
    where: { id: scheduleId },
    data: { status: 'completed' }
  })

  if (current.recurrence === 'monthly') {
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
        status: 'pending'
      }
    })
  } else if (current.recurrence === 'annual') {
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
        status: 'pending'
      }
    })
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

export async function getProjectById(id: string) {
  return await prisma.project.findUnique({
    where: { id },
    include: { customer: true, schedules: { orderBy: { date: 'asc' } } }
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

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const usersStr = formData.get('numberOfUsersForBilling') as string
  const numberOfUsersForBilling = usersStr ? parseInt(usersStr) : 1

  if (!name) throw new Error('Project name is required')

  await prisma.project.update({
    where: { id },
    data: { name, numberOfUsersForBilling }
  })

  revalidatePath('/projects')
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } })
  revalidatePath('/projects')
  revalidatePath('/')
}
