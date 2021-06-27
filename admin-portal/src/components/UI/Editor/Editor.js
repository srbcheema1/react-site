import PropType from "prop-types";
import { ImageDrop } from "./ImageDrop";
import ImageResize from "quill-image-resize-module";
import VideoResize from "quill-video-resize-module";

import React from "react";
import ReactQuill, { Quill } from "react-quill";
import "./Editor.scss";

Quill.register("modules/imageResize", ImageResize);
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/videoResize", VideoResize);

let Block = Quill.import("blots/block");
Block.tagName = "div";
Quill.register(Block);

const Editor = props => {
  return (
    <ReactQuill
      onChange={props.onChange}
      modules={
        props.modules
          ? props.modules
          : props.minimal
            ? minimal_modules
            : all_modules
      }
      value={props.value}
      placeholder={props.placeholder}
    />
  );
};

Editor.defaultProps = {
  placeholder: "Enter text here",
  minimal: false,
  value: ""
};

Editor.propTypes = {
  onChange: PropType.func.isRequired,
  placeholder: PropType.string,
  value: PropType.string,
  minimal: PropType.bool,
  modules: PropType.object
};

export default Editor;

/*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
*/

const minimal_modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline"], // toggled buttons
      ["clean"]
    ]
  },
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

const all_modules = {
  toolbar: {
    container: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }, { align: [] }],
      ["clean"] // remove formatting button
    ]
  },
  imageResize: true,
  videoResize: true,
  imageDrop: true,
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
  // syntax: true // Include syntax module
};
