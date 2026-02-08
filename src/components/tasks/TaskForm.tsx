import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Task } from "../../types";

interface TaskFormProps { isOpen: boolean; onClose: () => void; onSubmit: (data: Partial<Task>) => void; task?: Task | null; }

export function TaskForm({ isOpen, onClose, onSubmit, task }: TaskFormProps) {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Partial<Task>>({
    defaultValues: { title: "", description: "", status: "todo", priority: "medium", startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] },
  });

  useEffect(() => {
    if (task) { reset({ title: task.title, description: task.description || "", status: task.status, priority: task.priority, startDate: task.startDate.split("T")[0], endDate: task.endDate.split("T")[0] }); }
    else { reset({ title: "", description: "", status: "todo", priority: "medium", startDate: new Date().toISOString().split("T")[0], endDate: new Date().toISOString().split("T")[0] }); }
  }, [task, reset]);

  const status = watch("status");
  const priority = watch("priority");
  const handleFormSubmit = (data: Partial<Task>) => { onSubmit({ ...data, ...(task ? { id: task.id } : {}) }); onClose(); };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-[#FFFFFF] dark:bg-[#1E293B] border-[#E5E7EB] dark:border-[#334155]">
        <DialogHeader className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#334155]">
          <DialogTitle className="text-[16px] font-semibold text-[#111827] dark:text-white leading-tight">
            {task ? t("form.editTask") : t("form.newTask")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.title")} *</Label>
            <Input id="title" {...register("title", { required: t("form.titleRequired") })} className="h-10 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px] text-[#111827] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF]" placeholder={t("form.titlePlaceholder")} />
            {errors.title && <p className="text-[12px] text-[#EF4444]">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.description")}</Label>
            <Textarea id="description" {...register("description")} rows={3} className="bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px] text-[#111827] dark:text-[#F1F5F9] placeholder:text-[#9CA3AF] resize-none" placeholder={t("form.descriptionPlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.status")}</Label>
              <Select value={status} onValueChange={(v) => setValue("status", v as Task["status"])}>
                <SelectTrigger className="h-10 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">{t("status.todo")}</SelectItem>
                  <SelectItem value="in-progress">{t("status.inProgress")}</SelectItem>
                  <SelectItem value="need-review">{t("status.review")}</SelectItem>
                  <SelectItem value="done">{t("status.done")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.priority")}</Label>
              <Select value={priority} onValueChange={(v) => setValue("priority", v as Task["priority"])}>
                <SelectTrigger className="h-10 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{t("status.low")}</SelectItem>
                  <SelectItem value="medium">{t("status.medium")}</SelectItem>
                  <SelectItem value="high">{t("status.high")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.startDate")}</Label>
              <Input id="startDate" type="date" {...register("startDate", { required: true })} className="h-10 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-[13px] font-medium text-[#111827] dark:text-[#F1F5F9]">{t("task.dueDate")}</Label>
              <Input id="endDate" type="date" {...register("endDate", { required: true })} className="h-10 bg-[#F9FAFB] dark:bg-[#0F172A] border-[#E5E7EB] dark:border-[#334155] text-[14px]" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#334155]">
            <button type="button" onClick={onClose} className="h-9 px-4 text-[13px] font-medium border border-[#E5E7EB] dark:border-[#334155] rounded-md text-[#374151] dark:text-[#F1F5F9] hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-all duration-150">
              {t("form.cancel")}
            </button>
            <button type="submit" className="h-9 px-4 text-[13px] font-medium bg-[#7C3AED] dark:bg-[#A78BFA] hover:bg-[#6D28D9] dark:hover:bg-[#8B5CF6] text-white dark:text-[#0F172A] rounded-md transition-all duration-150">
              {task ? t("form.update") : t("form.create")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
