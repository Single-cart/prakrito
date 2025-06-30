"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Search from "./Search";

const MobileSearchDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SearchIcon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Your Product</DialogTitle>
        </DialogHeader>
        <Search searchRoute="/products" onSearch={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  );
};

export default MobileSearchDialog;
