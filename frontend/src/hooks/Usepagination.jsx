import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Usepagination(path, queryparams = {}, limit = 1, page = 1) {
  const [blogs, setblogs] = useState([]);
  const [hashmore, sethashmore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchblogs() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${path}`,
          {
            params: {
              ...queryparams,
              page,
              limit,
            },
          },
        );
        setblogs((prev) =>
          page === 1 ? res.data.allblog : [...prev, ...res.data.allblog],
        );

        sethashmore(res.data.hashmore);
      } catch (error) {
        // console.log(error.message);
        navigate(-1);
        toast.error(error.message);
        setblogs([]);
        sethashmore(false);
      }
    }

    fetchblogs();
  }, [page, path, JSON.stringify(queryparams)]);

  return { blogs, hashmore };
}

export default Usepagination;
