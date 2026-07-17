import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";

export default function SettingsHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-2"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted">
          <Settings2 className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Settings
          </h1>

          <p className="text-sm text-muted-foreground">
            Configure company, organization, attendance, leave, payroll,
            security, notifications, appearance, and other system preferences.
          </p>
        </div>
      </div>
    </motion.header>
  );
}