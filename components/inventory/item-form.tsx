// components/inventory/item-form.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, Camera, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  createItemSchema,
  type CreateItemFormValues,
} from "@/lib/schemas/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventoryItemAnalysis, Item, TaskData } from "@/lib/types";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { CategoryItemSelect } from "./item-category-select";
import { clientService } from "@/lib/services/client-service";

interface ItemFormProps {
  onSuccess: () => void;
  initialData?: Item; // <--- NEW PROP
}

const MAX_FILE_SIZE_MB = 10;

export function ItemForm({ onSuccess, initialData }: ItemFormProps) {
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pollCountRef = useRef(0);
  const pollIdRef = useRef<NodeJS.Timeout>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;

  const form = useForm<CreateItemFormValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      level: (initialData?.level as any) || "intern",
      description: initialData?.description || "",
      location: initialData?.location || "",
      available: initialData?.available || 0,
      in_use: initialData?.in_use || 0,
      damaged: initialData?.damaged || 0,
      total: initialData?.total || 0,
    },
  });

  // 2. Req #3: Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await clientService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // 3. Auto-Calculate Total (Better UX than just validating)
  const available = form.watch("available");
  const inUse = form.watch("in_use");
  const damaged = form.watch("damaged");

  useEffect(() => {
    const sum =
      (Number(available) || 0) + (Number(inUse) || 0) + (Number(damaged) || 0);
    form.setValue("total", sum, { shouldValidate: true });
  }, [available, inUse, damaged, form]);

  const mutation = useMutation({
    mutationFn: async (values: CreateItemFormValues) => {
      const url = isEditing ? `/api/items/${initialData.id}` : "/api/items";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: JSON.stringify(values),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save item");
      return json.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      // If editing, invalidate the specific item query too
      if (initialData) {
        queryClient.invalidateQueries({ queryKey: ["item", initialData.id] });
      }
      if (!isEditing) form.reset();
      onSuccess();
    },
  });

  function onSubmit(data: CreateItemFormValues) {
    mutation.mutate(data);
  }

  async function onAnalysis(res: InventoryItemAnalysis) {
    form.setValue("name", res.name);
    form.setValue("level", res.level);
    form.setValue("category", res.category);
    form.setValue("description", res.description);
    form.setValue("available", res.available);
  }

  const pollForResults = async (taskId: string) => {
    try {
      if (pollCountRef.current >= 10) {
        clearInterval(pollIdRef.current);
        pollCountRef.current = 0;
        throw new Error("Task timeout");
      }

      let img_data: TaskData<InventoryItemAnalysis>;
      const res = await fetch(`/api/tasks/${taskId}`);
      const json = await res.json();
      img_data = json.item_data;

      if (img_data.status === "PENDING" || img_data.status === "STARTED") {
        console.log("Processing Image...", pollCountRef.current);
      } else if (img_data.status === "SUCCESS") {
        clearInterval(pollIdRef.current);
        pollCountRef.current = 0;
        setIsAnalyzing(false);
        onAnalysis(img_data.result);
        toast.success("Analysis complete");
      } else if (img_data.status === "FAILURE") {
        throw new Error(json.error || "Task failed on server");
      }
      pollCountRef.current += 1;
    } catch (err) {
      clearInterval(pollIdRef.current);
      pollCountRef.current = 0;
      setIsAnalyzing(false);
      if (err instanceof Error)
        toast.error("Polling failed", { description: err.message });
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024)
        throw new Error("Max file size exceeded");

      // Create a local preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);

      setIsAnalyzing(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch(`/api/items/analyse`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");
      const json = await uploadRes.json();
      const { task_id } = json;

      const id = setInterval(() => pollForResults(task_id), 4000);
      pollIdRef.current = id;
    } catch (err) {
      setIsAnalyzing(false);
      if (err instanceof Error)
        toast.error("Error", { description: err.message });
    }
  };

  // 3. Clear Image
  const clearImage = () => {
    clearInterval(pollIdRef.current);
    pollCountRef.current = 0;
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{isEditing ? "Edit Item" : "Create New Item"}</CardTitle>
            <CardDescription>
              {isEditing
                ? `Update details for ${initialData.name}`
                : "Add a new item to your inventory"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageSelect}
            />

            {!imagePreview ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                Scan Item {"(<10MB)"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={clearImage}
                className="gap-2 text-destructive hover:text-destructive cursor-pointer"
              >
                <X className="h-4 w-4" />
                Remove Scan
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* 5. IMAGE PREVIEW AREA */}
        {imagePreview && (
          <div className="mb-6 rounded-lg border border-dashed p-4 flex gap-4 items-center bg-muted/30">
            <div className="relative h-20 w-20 rounded-md overflow-hidden border">
              <img
                src={imagePreview}
                alt="Preview"
                className={`h-full w-full object-cover transition-all ${
                  isAnalyzing ? "opacity-50 grayscale" : ""
                }`}
              />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">Image Captured</p>
                {isAnalyzing && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 font-semibold animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing...
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset
              disabled={isAnalyzing || mutation.isPending}
              className="space-y-6 group-disabled:opacity-50"
            >
              <div className="grid gap-4 md:grid-cols-2">
                {/* REQ #2: NAME AUTOCOMPLETE */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Item name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* REQ #3: CATEGORY SELECT */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => {
                    // 1. Create local state to manage the popover and the search term

                    const [open, setOpen] = useState(false);

                    const [inputValue, setInputValue] = useState("");

                    return (
                      <CategoryItemSelect
                        open={open}
                        setOpen={setOpen}
                        categories={categories}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        field={field}
                        form={form}
                      />
                    );
                  }}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe the item..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Shelf A, Room 101..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- NEW LEVEL FIELD --- */}
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <div className="relative">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="guest">Guest</SelectItem>
                            <SelectItem value="intern">Intern</SelectItem>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* Chevron Icon for style */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* NUMBERS ROW */}
              <div className="grid gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="in_use"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>In Use</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="damaged"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Damaged</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TOTAL - Read Only & Calculated */}
                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          readOnly
                          className="bg-muted font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Saving..."
                    : isEditing
                    ? "Update Item"
                    : "Create Item"}
                </Button>
              </div>

              {mutation.isError && (
                <p className="text-red-500 text-sm mt-2">
                  Failed to create item. {mutation.error.message}
                </p>
              )}
            </fieldset>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
