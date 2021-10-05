import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { useHeaderDispatch, closeSideBar } from '../context/header.context';
import { useCategoryState } from '../context/category.context';
import { getAgent } from '../utils/detectAgent.js';

export default function Gnb() {
  const agent = JSON.stringify(getAgent()); // test code

  const history = useHistory();
  const headerDispatch = useHeaderDispatch();

  const [hovering, setHovering] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1);

  const [activeMIndex, setActiveMIndex] = useState(-1);

  const routePushAndClose = (gcc) => {
    if (gcc?.href) {
      closeSideBar(headerDispatch);
      window.open(gcc.href);
    }

    if (gcc?.route) {
      history.push(gcc.route);
      closeSideBar(headerDispatch);
    }
  };

  const { gnbCategories } = useCategoryState();
  const gnbRef = useRef();

  return (
    <>
      <nav className={`gnb ${hovering ? 'gnb--active' : ''}`} ref={gnbRef}>
        <ul
          className="gnb__menu"
          onMouseOver={() => {
            setHovering(true);
          }}
          onMouseLeave={() => {
            setHovering(false);
          }}
        >
          {gnbCategories.map((gc, index) => {
            return (
              <li
                key={`gnb-menu-${index}`}
                className={`${activeIndex === index ? 'active' : ''} ${activeMIndex === index ? 'mo--active' : ''}`}
                onMouseOver={() => {
                  setActiveIndex(index);
                }}
                onMouseLeave={() => {
                  setActiveIndex(-1);
                }}
              >
                <a
                  href="#none"
                  onClick={(e) => {
                    setActiveMIndex(index);
                    e.preventDefault();
                  }}
                >
                  {gc.label}
                </a>
                <ul className="gnb__menu__secondary">
                  {gc.children.map((gcc, gccIndex) => {
                    return (
                      <li key={`gnb-menu-${index}-${gccIndex}`}>
                        <a
                          href="#none"
                          onClick={(e) => {
                            gnbRef.current.classList.remove('gnb--active');
                            routePushAndClose(gcc);
                            e.preventDefault();
                          }}
                        >
                          {gcc.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>
      <h1>app config : {agent}</h1>
    </>
  );
}
