import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRef } from "react";
import { FixedCropper, ImageRestriction } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

export default function ImageCropDialog({
  open = false,
  onClose = () => {},
  image,
  onCropped = (image) => {},
}) {
  const cropperRef = useRef(null);

  const crop = () => {
    if (cropperRef === null) return;
    const dUrl = cropperRef.current?.getCanvas()?.toDataURL("image/jpeg");
    if (dUrl !== null) {
      onCropped(dUrl);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Crop Your Picture</DialogTitle>
      <DialogContent>
        <FixedCropper
          ref={cropperRef}
          src={image}
          stencilSize={{
            width: 280,
            height: 280,
          }}
          imageRestriction={ImageRestriction.stencil}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={crop}>Crop</Button>
      </DialogActions>
    </Dialog>
  );
}
