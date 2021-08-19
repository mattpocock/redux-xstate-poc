import type { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";

let renders = 0;

const Home: NextPage = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

  useEffect(() => {
    renders++;
    console.log(renders);
  });

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() =>
            dispatch({
              type: "increment",
            })
          }
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() =>
            dispatch({
              type: "decrement",
            })
          }
        >
          Decrement
        </button>
      </div>
    </div>
  );
};

export default Home;
