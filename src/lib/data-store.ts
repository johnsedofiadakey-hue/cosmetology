import { bucket } from "@/lib/firebase-admin";
import { defaultStore } from "@/lib/default-data";

export type Store = {
  settings: typeof defaultStore.settings;
  services: any[];
  inventory: any[];
  users: any[];
  clients: any[];
  staff: any[];
  appointments: any[];
  formulations: any[];
  portfolio: any[];
};

const STORE_FILE = "app-state/store.json";

function cloneDefaultStore(): Store {
  return JSON.parse(JSON.stringify(defaultStore));
}

function mergeWithDefaults(data: Partial<Store> | null | undefined): Store {
  const base = cloneDefaultStore();
  if (!data) return base;

  return {
    ...base,
    ...data,
    settings: { ...base.settings, ...(data.settings || {}) },
    services: Array.isArray(data.services) && data.services.length ? data.services : base.services,
    inventory: Array.isArray(data.inventory) && data.inventory.length ? data.inventory : base.inventory,
    users: Array.isArray(data.users) && data.users.length ? data.users : base.users,
    clients: Array.isArray(data.clients) && data.clients.length ? data.clients : base.clients,
    staff: Array.isArray(data.staff) && data.staff.length ? data.staff : base.staff,
    appointments: Array.isArray(data.appointments) ? data.appointments : base.appointments,
    formulations: Array.isArray(data.formulations) ? data.formulations : base.formulations,
    portfolio: Array.isArray(data.portfolio) ? data.portfolio : base.portfolio,
  };
}

export async function readStore(): Promise<Store> {
  try {
    const file = bucket.file(STORE_FILE);
    const [exists] = await file.exists();
    if (!exists) {
      const initial = cloneDefaultStore();
      await writeStore(initial);
      return initial;
    }

    const [contents] = await file.download();
    return mergeWithDefaults(JSON.parse(contents.toString("utf8")));
  } catch (error) {
    console.error("[DATA_STORE_READ]", error);
    return cloneDefaultStore();
  }
}

export async function writeStore(store: Store): Promise<void> {
  await bucket.file(STORE_FILE).save(JSON.stringify(store, null, 2), {
    contentType: "application/json",
    resumable: false,
    metadata: {
      cacheControl: "private, no-store",
    },
  });
}

export async function updateStore<T>(updater: (store: Store) => T | Promise<T>): Promise<T> {
  const store = await readStore();
  const result = await updater(store);
  await writeStore(store);
  return result;
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function asDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}
