import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { readStore } from '@/lib/data-store';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF")) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const store = await readStore();
    const formattedClients = store.clients.map((client) => {
      const user = store.users.find((item) => item.id === client.userId);
      const appointments = store.appointments
        .filter((apt) => apt.clientId === client.id)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      const formulations = store.formulations
        .filter((item) => item.clientId === client.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const totalSpent = appointments.reduce((sum, apt) => sum + apt.totalPrice, 0);
      const lastVisit = appointments[0]?.startTime || null;

      return {
        id: client.id,
        name: user?.name || "Unknown Client",
        email: user?.email || "",
        phone: client.phone,
        lastVisit: lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never',
        totalSpent,
        history: appointments.map((apt) => ({
          id: apt.id,
          date: new Date(apt.startTime).toLocaleDateString(),
          service: (apt.serviceIds as string[]).map((serviceId: string) => store.services.find((service: any) => service.id === serviceId)?.name).filter(Boolean).join(', ') || 'No services',
          amount: apt.totalPrice,
          notes: "Service completed."
        })),
        formulations: formulations.map((f) => ({
          id: f.id,
          title: f.title,
          date: new Date(f.createdAt).toLocaleDateString(),
          mix: f.description
        }))
      };
    });

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}
