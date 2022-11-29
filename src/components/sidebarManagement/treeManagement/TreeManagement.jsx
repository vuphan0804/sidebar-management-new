import React, { useState } from "react";
import SortableTree, {
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
  toggleExpandedForAll,
} from "react-sortable-tree";

const TreeManagement = ({
  treeData,
  updateTreeData,
  searchString,
  searchFocusIndex,
  setSearchFoundCount,
  setSearchFocusIndex,
  addNodeSibling,
  addNodeChild,
  updateNode,
  removeNode,
  alertNodeInfo,
}) => {
  return (
    <div style={{ height: "100vh" }}>
      <SortableTree
        treeData={treeData}
        onChange={(treeData) => updateTreeData(treeData)}
        searchQuery={searchString}
        searchFocusOffset={searchFocusIndex}
        searchFinishCallback={(matches) => {
          setSearchFoundCount(matches.length);
          setSearchFocusIndex(
            matches.length > 0 ? searchFocusIndex % matches.length : 0
          );
        }}
        canDrag={({ node }) => !node.dragDisabled}
        generateNodeProps={(rowInfo) => ({
          // title: rowInfo.node.label,
          // subtitle: rowInfo.node.subTitle,
          buttons: [
            <div className="text-sm">
              <button
                className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-md transition-primary"
                label="Add Sibling"
                onClick={(event) => addNodeSibling(rowInfo)}
              >
                Add Sibling
              </button>
              <button
                className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-full transition-primary"
                label="Add Child"
                onClick={(event) => addNodeChild(rowInfo)}
              >
                <i class="fa-solid fa-plus"></i>
              </button>
              <button
                className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-full transition-primary"
                label="Update"
                onClick={(event) => updateNode(rowInfo)}
              >
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button
                className="px-2 py-1 mx-2 text-white bg-red-400 hover:bg-red-500 rounded-full transition-primary"
                label="Delete"
                onClick={(event) => removeNode(rowInfo)}
              >
                <i class="fa-sharp fa-solid fa-trash"></i>
              </button>
              <button
                className="px-2 py-1 mx-2 text-white bg-blue-400 hover:bg-blue-500 rounded-full transition-primary"
                label="Alert"
                onClick={(event) => alertNodeInfo(rowInfo)}
              >
                <i class="fa-sharp fa-solid fa-circle-info"></i>
              </button>
            </div>,
          ],
          style: {
            height: "50px",
          },
        })}
      />
    </div>
  );
};

export default TreeManagement;
