/**
 * Settings Page
 *
 * Provides two setting cards:
 * 1. Theme — toggle between Light / Dark / System
 * 2. Language — switch between English and French (i18n)
 *
 * On mobile, a top bar with a hamburger menu (to reopen the sidebar)
 * and a back arrow (to return to the tasks page) is shown.
 */

import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Sun, Moon, Monitor, Globe, ArrowLeft, Menu } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useThemeStore } from "../store/themeStore";
import { cn } from "../lib/utils";

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();
  const ctx = useOutletContext<{ onToggleSidebar: () => void; isMobile: boolean } | undefined>();

  const themes = [
    { value: "light", label: t("settings.light") || "Light", icon: Sun },
    { value: "dark", label: t("settings.dark") || "Dark", icon: Moon },
    { value: "system", label: t("settings.system") || "System", icon: Monitor },
  ] as const;

  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-[#0F172A]">
      {/* Mobile top bar — back arrow + sidebar toggle */}
      <div className="flex items-center h-12 border-b border-[#E5E7EB] dark:border-[#334155] lg:hidden px-4 sm:px-6 gap-2">
        {ctx?.isMobile && (
          <button
            onClick={ctx.onToggleSidebar}
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-colors shrink-0"
          >
            <Menu className="w-5 h-5 text-[#6B7280] dark:text-[#94A3B8]" strokeWidth={1.5} />
          </button>
        )}
        <button
          onClick={() => navigate("/")}
          className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-[#6B7280] dark:text-[#94A3B8]" strokeWidth={1.5} />
        </button>
        <span className="text-[16px] font-semibold text-[#111827] dark:text-white leading-tight ml-1">
          {t("settings.title")}
        </span>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
        <h1 className="text-[20px] font-semibold text-[#111827] dark:text-white mb-6 sm:mb-8 hidden lg:block leading-tight">
          {t("settings.title")}
        </h1>

        {/* ── Theme card ── */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EDE9FE] dark:bg-[#4C1D95]/40 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED] dark:text-[#A78BFA]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white leading-tight">
                {t("settings.theme")}
              </h2>
              <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]">
                {t("settings.themeDescription")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {themes.map((o) => (
              <button
                key={o.value}
                onClick={() => setTheme(o.value as "light" | "dark" | "system")}
                className={cn(
                  "flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-150",
                  theme === o.value
                    ? "border-[#7C3AED] dark:border-[#A78BFA] bg-[#EDE9FE] dark:bg-[#4C1D95]/30"
                    : "border-[#E5E7EB] dark:border-[#334155] hover:border-[#D1D5DB] dark:hover:border-[#475569]"
                )}
              >
                <o.icon
                  className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6",
                    theme === o.value ? "text-[#7C3AED] dark:text-[#A78BFA]" : "text-[#6B7280] dark:text-[#94A3B8]"
                  )}
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "text-[12px] sm:text-[13px] font-medium",
                    theme === o.value ? "text-[#7C3AED] dark:text-[#A78BFA]" : "text-[#6B7280] dark:text-[#94A3B8]"
                  )}
                >
                  {o.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Language card ── */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#EDE9FE] dark:bg-[#4C1D95]/40 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#7C3AED] dark:text-[#A78BFA]" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-[#111827] dark:text-white leading-tight">
                {t("settings.language")}
              </h2>
              <p className="text-[13px] font-normal text-[#6B7280] dark:text-[#94A3B8]">
                {t("settings.languageDescription")}
              </p>
            </div>
          </div>
          <Select value={i18n.language} onValueChange={(v) => i18n.changeLanguage(v)}>
            <SelectTrigger className="w-full h-10 sm:h-11 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[13px] sm:text-[14px] text-[#111827] dark:text-[#F1F5F9]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">
                <div className="flex items-center gap-2"><span>🇺🇸</span><span>{t("language.en")}</span></div>
              </SelectItem>
              <SelectItem value="fr">
                <div className="flex items-center gap-2"><span>🇫🇷</span><span>{t("language.fr")}</span></div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
