import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { fromHtml } from "hast-util-from-html";

const ParseAndPreview = () => {
  const [htmlStr, setHtmlStr] = useState("");
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  const [parsedHtml, setParsedHtml] = useState(undefined);

  const onChangeHtmlStr = (e) => {
    setHtmlStr(e.target.value);
  };

  useEffect(() => {
    setSanitizedHtml(DOMPurify.sanitize(htmlStr));
  }, [htmlStr]);

  useEffect(() => {
    const parsedHtmlObj = fromHtml(sanitizedHtml.trim(), {
      fragment: true,
    });
    setParsedHtml(parsedHtmlObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitizedHtml]);

  // This is a recursive function to render the html tree
  // which basically returns an unordered list
  const getTree = (children) => {
    if (children) {
      // Filtering children with only of type `element`
      const filteredChildren = children.filter(
        (item) => item.type === "element"
      );
      return (
        // Returning an unordered list
        <ul>
          {filteredChildren.map((item, i) => {
            return (
              <li key={i} style={{ textAlign: "left" }}>
                <button
                  onClick={() => {
                    document.getElementById(
                      item.properties.id
                    ).style.backgroundColor = "bisque";
                    setTimeout(() => {
                      document.getElementById(
                        item.properties.id
                      ).style.backgroundColor = "transparent";
                    }, 1000);
                  }}
                  style={{ cursor: "pointer", margin: "4px 0px" }}
                >
                  <b>{item.tagName}</b>
                  {"    "}
                  <mark>id - {item.properties.id}</mark>
                </button>
                {/* Render any children this node may have */}
                {getTree(item?.children)}
              </li>
            );
          })}
        </ul>
      );
    }
    return <></>;
  };

  return (
    <div id="page-root" style={{ display: "flex", height: "100%" }}>
      <div
        id="html-input-container"
        style={{ width: "33.33%", border: "1px solid black" }}
      >
        <p>HTML</p>
        <textarea
          style={{ width: "90%", height: "90%" }}
          value={htmlStr}
          onChange={onChangeHtmlStr}
        ></textarea>
      </div>
      <div
        id="tree-parse-container"
        style={{ width: "33.33%", border: "1px solid black" }}
      >
        <p>Tree Parse</p>
        <div>{getTree(parsedHtml?.children)}</div>
      </div>
      <div
        id="preview-container"
        style={{ width: "33.33%", border: "1px solid black" }}
      >
        <p>Preview</p>
        <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }}></div>
      </div>
    </div>
  );
};

export default ParseAndPreview;
