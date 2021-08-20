import type { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";

const Home: NextPage = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

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
