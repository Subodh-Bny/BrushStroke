"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetArtists } from "@/services/api/userApi";
import { UseFormSetValue } from "react-hook-form";

const ArtistsSelect = ({
  setValue,
}: {
  setValue: UseFormSetValue<Artwork>;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");

  const { data: artists } = useGetArtists();
  //   console.log(artists);
  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between"
        >
          {inputValue
            ? artists?.find((artist) => artist.username === inputValue)
                ?.username
            : "Select framework..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] max-h-72 p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {artists?.map((artist) => (
                <CommandItem
                  key={artist._id}
                  value={artist.username}
                  onSelect={(currentValue) => {
                    setInputValue(
                      currentValue === inputValue ? "" : currentValue
                    );
                    setValue("artist", artist._id || "");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      inputValue === artist.username
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {artist.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ArtistsSelect;
