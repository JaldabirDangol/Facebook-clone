import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const SearchDialog = ({ open, setOpen, searchResults, setSearchResults }) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
          
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
