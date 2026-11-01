import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImportProjectForm() {
  return (
    <form
      action="/projects/new/import"
      method="get"
      className="flex w-full flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground sm:p-6"
    >
      <div className="space-y-1">
        <Label htmlFor="sourceUrl">Repository URL</Label>
      </div>
      <Input
        name="sourceUrl"
        id="sourceUrl"
        type="url"
        required
        placeholder="https://github.com/owner/repository"
      />
      <Button className="w-full sm:w-fit">Inspect repository</Button>
    </form>
  );
}
