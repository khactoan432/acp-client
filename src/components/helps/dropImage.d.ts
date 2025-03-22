import React from "react";
interface ImageUploaderProps {
    titleBtn?: string;
    onImagesChange?: (files: File[]) => void;
    onUrlsReset?: () => void;
    urls?: string;
    filesParent?: File[];
    typefile: string;
    reset?: boolean;
}
declare const ImageUploader: React.FC<ImageUploaderProps>;
export default ImageUploader;
