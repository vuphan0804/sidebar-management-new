import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import {
  FiHome,
  FiBell,
  FiGlobe,
  FiPhoneCall,
  FiMenu,
  FiPackage,
  FiLogOut,
  FiChevronsRight,
} from "react-icons/fi";
import { FaEquals } from "react-icons/fa";
import "./SidebarMain.scss";
import Marquee from "react-fast-marquee";

const SidebarMain = ({ data, fetchSidebars }) => {
  const { collapseSidebar } = useProSidebar();
  const [treeData, setTreeData] = useState([]);
  const [start, setStart] = useState(false);

  const handleStartMarquee = () => {
    setStart(true);
  };
  const handleStopMarquee = () => {
    setStart(false);
  };
  useEffect(() => {
    setTreeData(data);
  }, [data]);

  // function checkOverflow(el) {
  //   let curOverflow = el.style.overflow;

  //   if (!curOverflow || curOverflow === "visible") el.style.overflow = "hidden";

  //   let isOverflowing =
  //     el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

  //   el.style.overflow = curOverflow;

  //   return isOverflowing;
  // }

  // const titleSpan = document.querySelectorAll("sc-gKPRtg ktVuSn menu-label");
  // const isEllipsisActive = (e) => {
  //   return e.offsetWidth < e.scrollWidth;
  // };
  // if (isEllipsisActive(titleSpan)) {
  //   console.log("overflow");
  // }
  // console.log("titleSpan", checkOverflow(titleSpan));

  const renderSidebar = (treeData) => {
    return treeData?.map((parent, index) => {
      if (parent.children && parent.children?.length > 0) {
        return (
          <SubMenu icon={<FiChevronsRight />} label={parent.title} key={index}>
            {renderSidebar(parent.children)}
          </SubMenu>
        );
      } else
        return (
          <MenuItem
            icon={<FiPackage />}
            routerLink={<Link to={`/${parent.title}`} />}
            key={index}
          >
            {parent.title}
          </MenuItem>
        );
    });
  };

  // const renderSidebar = (treeData) => {
  //   return treeData?.map((parent, index) => {
  //     if (parent.children && parent.children?.length > 0) {
  //       if (parent.title.length > 25) {
  //         return (
  //           <SubMenu
  //             icon={<FiChevronsRight />}
  //             label={
  //               <div
  //                 onMouseEnter={handleStartMarquee}
  //                 onMouseLeave={handleStopMarquee}
  //               >
  //                 <Marquee play={start}>{parent.title}</Marquee>
  //               </div>
  //             }
  //             key={index}
  //           >
  //             {renderSidebar(parent.children)}
  //           </SubMenu>
  //         );
  //       } else
  //         return (
  //           <SubMenu
  //             icon={<FiChevronsRight />}
  //             label={parent.title}
  //             key={index}
  //           >
  //             {renderSidebar(parent.children)}
  //           </SubMenu>
  //         );
  //     }
  //     if (parent.title.length > 25) {
  //       return (
  //         <MenuItem
  //           icon={<FiStar />}
  //           routerLink={<Link to={`/${parent.title}`} />}
  //           key={index}
  //         >
  //           <div
  //             onMouseEnter={handleStartMarquee}
  //             onMouseLeave={handleStopMarquee}
  //           >
  //             <Marquee play={start}>{parent.title}</Marquee>
  //           </div>
  //         </MenuItem>
  //       );
  //     } else
  //       return (
  //         <MenuItem
  //           icon={<FiStar />}
  //           routerLink={<Link to={`/${parent.title}`} />}
  //           key={index}
  //         >
  //           {parent.title}
  //         </MenuItem>
  //       );
  //   });
  // };

  return (
    <div className="fixed flex mt-15 h-full">
      <Sidebar width="300px" collapsedWidth="80px">
        <div className="text-xl font-medium text-center mt-28">Sidebar</div>
        <div className="mx-8 left-10 z-10">
          <button onClick={() => collapseSidebar()}>
            <FiMenu />
          </button>
        </div>

        <Menu className="transition-primary">
          <MenuItem
            className="visited:bg-red-400 home-test"
            routerLink={<Link to="/" />}
            icon={<FiHome />}
          >
            Trang chủ
          </MenuItem>
          {renderSidebar(treeData)}
        </Menu>
      </Sidebar>
      {/* <Menu className="absolute bottom-0 w-full bg-zinc-200 z-10">
        <SubMenu
          className=""
          label={
            <div
              onMouseEnter={handleStartMarquee}
              onMouseLeave={handleStopMarquee}
            >
              <Marquee
                // play={true}
                play={start}
              >
                Thông báo
              </Marquee>
            </div>
          }
          icon={<FiBell />}
        >
          <MenuItem> Lịch nghỉ</MenuItem>
          <MenuItem> Nâng cấp </MenuItem>
        </SubMenu>
        <MenuItem icon={<FiGlobe />}>Dịch vụ</MenuItem>
        <MenuItem icon={<FiPhoneCall />}> Liên hệ </MenuItem>

        <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
      </Menu> */}
    </div>
  );
};

export default SidebarMain;
