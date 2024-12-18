import React from "react";

export const LoadingScreen: React.FC = () => {
  const loadingStyles = `
    :root {
      --thickness: 5px;
      --duration: 2500ms;
      --delay: calc(var(--duration) / 6);
    }

    .bookshelf_wrapper {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .books_list {
      margin: 0 auto;
      width: 300px;
      padding: 0;
    }

    .book_item {
      position: absolute;
      top: -120px;
      box-sizing: border-box;
      list-style: none;
      width: 40px;
      height: 120px;
      opacity: 0;
      background-color: #1e6cc7;
      border: var(--thickness) solid white;
      transform-origin: bottom left;
      transform: translateX(300px);
      animation: travel var(--duration) linear infinite;
    }

    .book_item.first {
      top: -140px;
      height: 140px;
    }

    .book_item.first::before,
    .book_item.first::after {
      content: "";
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      height: var(--thickness);
      background-color: white;
    }

    .book_item.first::after {
      top: initial;
      bottom: 10px;
    }

    .book_item.second,
    .book_item.fifth {
      &:before,
      &:after {
        box-sizing: border-box;
        content: "";
        position: absolute;
        top: 10px;
        left: 0;
        width: 100%;
        height: calc(var(--thickness) * 3.5);
        border-top: var(--thickness) solid white;
        border-bottom: var(--thickness) solid white;
      }

      &:after {
        top: initial;
        bottom: 10px;
      }
    }

    .book_item.third::before,
    .book_item.third::after {
      box-sizing: border-box;
      content: "";
      position: absolute;
      top: 10px;
      left: 9px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: var(--thickness) solid white;
    }

    .book_item.third::after {
      top: initial;
      bottom: 10px;
    }

    .book_item.fourth {
      top: -130px;
      height: 130px;
    }

    .book_item.fourth::before {
      box-sizing: border-box;
      content: "";
      position: absolute;
      top: 46px;
      left: 0;
      width: 100%;
      height: calc(var(--thickness) * 3.5);
      border-top: var(--thickness) solid white;
      border-bottom: var(--thickness) solid white;
    }

    .book_item.fifth {
      top: -100px;
      height: 100px;
    }

    .book_item.sixth {
      top: -140px;
      height: 140px;
    }

    .book_item.sixth::before {
      box-sizing: border-box;
      content: "";
      position: absolute;
      bottom: 31px;
      left: 0px;
      width: 100%;
      height: var(--thickness);
      background-color: white;
    }

    .book_item.sixth::after {
      box-sizing: border-box;
      content: "";
      position: absolute;
      bottom: 10px;
      left: 9px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: var(--thickness) solid white;
    }

    .book_item:nth-child(2) {
      animation-delay: calc(var(--delay) * 1);
    }

    .book_item:nth-child(3) {
      animation-delay: calc(var(--delay) * 2);
    }

    .book_item:nth-child(4) {
      animation-delay: calc(var(--delay) * 3);
    }

    .book_item:nth-child(5) {
      animation-delay: calc(var(--delay) * 4);
    }

    .book_item:nth-child(6) {
      animation-delay: calc(var(--delay) * 5);
    }

    .shelf {
      width: 300px;
      height: var(--thickness);
      margin: 0 auto;
      background-color: white;
      position: relative;
    }

    .shelf::before,
    .shelf::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        rgba(255, 255, 255, 0.5) 30%,
        transparent 0
      );
      background-size: 10px 10px;
      background-position: 0 -2.5px;
      top: 200%;
      left: 5%;
      animation: move calc(var(--duration) / 10) linear infinite;
    }

    .shelf::after {
      top: 400%;
      left: 7.5%;
    }

    @keyframes move {
      from {
        background-position-x: 0;
      }
      to {
        background-position-x: 10px;
      }
    }

    @keyframes travel {
      0% {
        opacity: 0;
        transform: translateX(300px) rotateZ(0deg) scaleY(1);
      }
      6.5% {
        transform: translateX(279.5px) rotateZ(0deg) scaleY(1.1);
      }
      8.8% {
        transform: translateX(273.6px) rotateZ(0deg) scaleY(1);
      }
      10% {
        opacity: 1;
        transform: translateX(270px) rotateZ(0deg);
      }
      17.6% {
        transform: translateX(247.2px) rotateZ(-30deg);
      }
      45% {
        transform: translateX(165px) rotateZ(-30deg);
      }
      49.5% {
        transform: translateX(151.5px) rotateZ(-45deg);
      }
      61.5% {
        transform: translateX(115.5px) rotateZ(-45deg);
      }
      67% {
        transform: translateX(99px) rotateZ(-60deg);
      }
      76% {
        transform: translateX(72px) rotateZ(-60deg);
      }
      83.5% {
        opacity: 1;
        transform: translateX(49.5px) rotateZ(-90deg);
      }
      90% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateX(0px) rotateZ(-90deg);
      }
    }
  `;

  return (
    <div className="bookshelf_wrapper">
      <style dangerouslySetInnerHTML={{ __html: loadingStyles }} />
      <ul className="books_list">
        <li className="book_item first"></li>
        <li className="book_item second"></li>
        <li className="book_item third"></li>
        <li className="book_item fourth"></li>
        <li className="book_item fifth"></li>
        <li className="book_item sixth"></li>
      </ul>
      <div className="shelf"></div>
    </div>
  );
};