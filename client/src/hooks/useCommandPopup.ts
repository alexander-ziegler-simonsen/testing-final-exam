import { useState } from "react";
import type { CommandFormMode } from "../components/dashboards/CommandFormPopup";

// Owns the open/mode/selected-item state shared by every dashboard page's
// create/edit/delete popup, so pages don't each redefine the same three
// open* handlers.
export function useCommandPopup<T>() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<CommandFormMode>("create");
    const [selected, setSelected] = useState<T | null>(null);

    const openCreate = () => {
        setSelected(null);
        setMode("create");
        setOpen(true);
    };

    const openEdit = (item: T) => {
        setSelected(item);
        setMode("edit");
        setOpen(true);
    };

    const openDelete = (item: T) => {
        setSelected(item);
        setMode("delete");
        setOpen(true);
    };

    return { open, setOpen, mode, selected, openCreate, openEdit, openDelete };
}
