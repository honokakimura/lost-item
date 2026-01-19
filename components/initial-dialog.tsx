"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "initialSetupAcknowledged";

function InitialSetupDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChange = (newOpenState: boolean) => {
    setIsOpen(newOpenState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-xl font-bold">
            落とし物をみつけた！
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            下記ボタンから、情報提供にご協力ください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
            <Button
            onClick={() => {
                setIsOpen(false);
                window.location.href="/post";
            }}
            className={`w-full h-12 font-semibold text-base order-1 sm:order-2 transition-opacity`}
          >
            落とし物を知らせる
          </Button>
        </div>

        <DialogFooter className="flex flex-col gap-3">
          {/* 承諾ボタン */}
          
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InitialSetupDialog;
