import type { EventBusKey } from "@vueuse/core";
import type { Toast } from "@/lib/types";

export const toastBusKey: EventBusKey<Toast> = Symbol("toast-event-bus");
