"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

type Props = {
  searchRoute: string;
  className?: string;
  onSearch?: () => void;
};

const Search: FC<Props> = ({ searchRoute, className, onSearch }) => {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (name) {
      router.push(`${searchRoute}?search=${name}`);
      setName("");
      onSearch?.(); // Call the onSearch callback if provided
    }
  };

  return (
    <div className={cn(className, "flex items-center justify-center w-full")}>
      <Input
        className="max-w-[500px] bg-secondary"
        name="search"
        placeholder="Search for products"
        onChange={(e) => setName(e.target.value)}
        value={name}
        required
      />
      <Button
        size={"icon"}
        onClick={handleSearch}
        variant={"outline"}
        className="bg-secondary"
      >
        <SearchIcon />
      </Button>
    </div>
  );
};

export default Search;
