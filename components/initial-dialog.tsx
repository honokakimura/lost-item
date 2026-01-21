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

const STORAGE_KEY = "initialDialogHiddenUntil";

function InitialSetupDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowForOneHour, setDoNotShowForOneHour] = useState(false);

  useEffect(() => {
    // マウント時にLocalStorageを確認
    const hiddenUntil = localStorage.getItem(STORAGE_KEY);
    const now = new Date().getTime();

    // 期限内（1時間以内）であれば表示しない
    if (hiddenUntil && now < parseInt(hiddenUntil, 10)) {
      return;
    }

    const timer = window.setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // 設定を保存するヘルパー関数
  const saveSettingsIfNeeded = () => {
    if (doNotShowForOneHour) {
      const oneHourLater = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, oneHourLater.toString());
    }
  };

  const handleOpenChange = (newOpenState: boolean) => {
    // ダイアログが閉じられるタイミングで保存
    if (!newOpenState) {
      saveSettingsIfNeeded();
    }
    setIsOpen(newOpenState);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle className="text-xl font-bold">
            落とし物をみつけた！
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            下記ボタンから、情報提供にご協力ください。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button
            onClick={() => {
              saveSettingsIfNeeded(); // 遷移前にも保存を実行
              setIsOpen(false);
              window.location.href = "/post";
            }}
            className="w-full h-12 font-semibold text-base"
          >
            落とし物を知らせる
          </Button>
        </div>

        <DialogFooter className="flex sm:justify-center">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="doNotShow" 
              checked={doNotShowForOneHour}
              onCheckedChange={(checked) => setDoNotShowForOneHour(checked as boolean)}
            />
            <Label 
              htmlFor="doNotShow" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              1時間は表示しない
            </Label>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InitialSetupDialog;