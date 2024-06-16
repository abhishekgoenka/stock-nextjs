import { toast } from "../ui/use-toast";

export const toastDBSaveSuccess = () => {
  toast({
    title: "Success",
    description: "Your changes have been saved successfully",
    variant: "default",
  });
};

export const toastDBSaveError = () => {
  toast({
    title: "Error",
    description: "Error has occured while saving changes",
    variant: "destructive",
  });
};
