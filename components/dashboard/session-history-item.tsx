"use client";

import { EllipsisVertical, History, Play, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { getTime } from "@/utils/date";
import { Button } from "../ui/button";
import { Session } from "@/types/session.type";
import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import {
    deleteSession,
    renameSession,
    resumeSession,
} from "@/services/sessions/sessions.service";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";

export function SessionHistoryItem({ session }: { session: Session }) {
    const router = useRouter();
    const [title, setTitle] = useState<string>(session.title);
    const [focused, setFocused] = useState<boolean>(false);

    useEffect(() => {
        setTitle(session.title);
    }, [session.title]);

    const save = async () => {
        const clean = title.trim();
        if (!clean || clean === session.title) {
            setFocused(false);
            return;
        }

        await renameSession(session.id, clean);
        setFocused(false);
        router.refresh();
    };

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const focus = (e: FocusEvent<HTMLInputElement, Element>) => {
        setFocused(true);
        e.target.select();
    };

    const keydown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            e.currentTarget.blur(); // cancel
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
            await save();
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const blur = (e: FocusEvent<HTMLInputElement, Element>) => {
        setFocused(false);
    };

    return (
        <li className="text-sm px-1 rounded-lg">
            {/* <div className="mb-2 flex justify-end items-center gap-1 text-xs text-muted-foreground/70"> */}
            {/*     {focused ? ( */}
            {/*         <span>Hit Enter to save</span> */}
            {/*     ) : ( */}
            {/*         <> */}
            {/*             <History className="size-3" /> */}
            {/*             <span>{getTime(session.created_at)}</span> */}
            {/*         </> */}
            {/*     )} */}
            {/* </div> */}
            <div className="flex items-center">
                <Input
                    value={title}
                    onBlur={blur}
                    onFocus={focus}
                    onChange={change}
                    onKeyDown={keydown}
                    className="!bg-transparent border-none"
                />
                <Badge variant={"outline"} className="ml-3 mr-1 text-muted-foreground/70">
                    {session.status}
                </Badge>
                <DropdownAction session={session}>
                    <Button variant={"ghost"} size={"icon-sm"}>
                        <EllipsisVertical />
                    </Button>
                </DropdownAction>
            </div>
            <div className="mt-1 text-xs text-muted-foreground/70">
                {focused && (
                    <span>Hit Enter to save</span>
                )}
            </div>
        </li>
    );
}

function DropdownAction({
    session,
    children,
}: {
    session: Session;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const onDelete = async () => {
        await deleteSession(session.id);
        router.refresh();
    };

    const navigator = async () => {
        await resumeSession(session.id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    {session.status === "PENDING" && (
                        <DropdownMenuItem onClick={navigator}>
                            <Play /> Resume
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive"
                    >
                        <DeleteDialog onDelete={onDelete}>
                            <div className="flex items-center gap-2 w-full">
                                <Trash className="text-destructive" /> Delete
                            </div>
                        </DeleteDialog>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DeleteDialog({
    children,
    onDelete,
}: {
    children: React.ReactNode;
    onDelete: () => void;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        session data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant={"destructive"} onClick={onDelete}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
