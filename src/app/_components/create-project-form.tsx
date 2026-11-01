"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function CreateProjectForm() {
  return (
    <form className="flex border flex-col p-4 rounded gap-2">
      <Label htmlFor="sourceUrl">Source URL(github or gitlab)</Label>
      <Input
        name="sourceUrl"
        id="sourceUrl"
        placeholder="Github or Gitlab URL"
      />
      <Label htmlFor="projectName">Project Name (must be unique)</Label>
      <Input name="projectName" id="projectName" placeholder="Project Name" />
      <Button>Deploy</Button>
    </form>
  );
}
