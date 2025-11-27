export function ItemForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Item</CardTitle>
        <CardDescription>Add a new item to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const rawData = Object.fromEntries(formData);

            // Trigger the mutation
            createItemMutation.mutate(rawData);
          }}
        >
          {/* Inputs remain the same... */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Item name"
                required
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="w-full px-3 py-2 border border-border rounded-lg"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <Label htmlFor="role">Role</Label>
            <div className="relative"></div>
            <select
              id="level"
              name="level"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            >
              <option value="guest">Guest</option>
              <option value="intern">Intern</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Available</label>
              <input
                type="number"
                name="available"
                defaultValue="0"
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">In Use</label>
              <input
                type="number"
                name="in_use"
                defaultValue="0"
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Damaged</label>
              <input
                type="number"
                name="damaged"
                defaultValue="0"
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Total</label>
              <input
                type="number"
                name="in_use"
                defaultValue="0"
                min="0"
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={createItemMutation.isPending} // Disable button while saving
          >
            {createItemMutation.isPending ? "Creating..." : "Create Item"}
          </Button>

          {/* Show error if mutation fails */}
          {createItemMutation.isError && (
            <p className="text-red-500 text-sm">
              Failed to create item. Try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
