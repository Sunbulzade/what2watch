// Imports - Node
import { redirect } from "next/navigation";

// Imports - Local
import { routing } from "@/lib/i18n/routing";

function RootPage(): React.ReactNode { return redirect(`/${routing.defaultLocale}`); }

// Exports
export default RootPage;
