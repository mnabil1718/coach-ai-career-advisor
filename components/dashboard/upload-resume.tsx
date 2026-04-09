"use client";

import Image from "next/image";
import Empty from "../../public/empty-docs.svg";
import { Upload, UploadConfigOptions } from "../upload";
import { MAX_FILE_SIZE_LIMIT, SUPABASE_UPLOADS_BUCKET } from "@/constants/file";
import { postResume } from "@/services/resume/resume.service";
import { useAuthContext } from "@/context/auth-context";
import { useRouter } from "nextjs-toploader/app";

export function UploadResume() {
    const router = useRouter();
    const { user } = useAuthContext();
    const config: UploadConfigOptions = {
        allowedMimeTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        onSuccess: async (files) => {
            await postResume(files[0].name, files[0].fullPath);
            router.refresh();
        },
        path: `resumes/${user?.sub}`,
        maxFiles: 1,
        maxFileSize: MAX_FILE_SIZE_LIMIT,
        bucketName: SUPABASE_UPLOADS_BUCKET,
    };

    return (
        <div className="w-full flex flex-col p-5 border rounded-lg border-border/30 items-center">
            <Image
                src={Empty}
                alt="No document illustration"
                width={64}
                className="mb-3 opacity-80"
            />
            <h2 className="text-muted-foreground mb-6">
                You have no uploaded CV. Start uploading below.
            </h2>
            <Upload config={config} />
        </div>
    );
}
